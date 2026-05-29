const DEFAULT_MODEL = 'gemini-2.5-flash'

/** Tried in order when the primary model fails or is overloaded */
const FALLBACK_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
]

const RETRYABLE_STATUSES = new Set([429, 502, 503, 504])
const MAX_RETRIES_PER_MODEL = 3

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function modelChain(preferred) {
    const chain = [preferred, ...FALLBACK_MODELS].filter(Boolean)
    return [...new Set(chain)]
}

function extractText(data) {
    const parts = data?.candidates?.[0]?.content?.parts || []
    return parts.map(p => p.text || '').join('').trim()
}

function stripFences(text) {
    return text
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()
}

function repairJsonString(str) {
    let s = stripFences(str)
    s = s.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'")
    s = s.replace(/,\s*([}\]])/g, '$1')
    return s
}

function closeTruncatedJson(str) {
    let s = str.trim()
    const stack = []
    let inString = false
    let escape = false

    for (let i = 0; i < s.length; i++) {
        const c = s[i]
        if (inString) {
            if (escape) escape = false
            else if (c === '\\') escape = true
            else if (c === '"') inString = false
            continue
        }
        if (c === '"') { inString = true; continue }
        if (c === '{') stack.push('}')
        else if (c === '[') stack.push(']')
        else if (c === '}' || c === ']') stack.pop()
    }

    while (stack.length) s += stack.pop()
    return s
}

function parseJsonLoose(raw) {
    const clean = repairJsonString(raw)
    const start = clean.indexOf('{')
    const end = clean.lastIndexOf('}')
    if (start === -1) throw new Error('No JSON object in AI response')

    let jsonStr = end > start ? clean.slice(start, end + 1) : clean.slice(start)

    const attempts = [
        () => JSON.parse(jsonStr),
        () => JSON.parse(repairJsonString(jsonStr)),
        () => JSON.parse(closeTruncatedJson(jsonStr)),
        () => JSON.parse(repairJsonString(closeTruncatedJson(jsonStr))),
    ]

    let lastErr
    for (const tryParse of attempts) {
        try {
            return tryParse()
        } catch (e) {
            lastErr = e
        }
    }

    const err = new Error('Failed to parse AI response as JSON')
    err.raw = jsonStr.slice(0, 400)
    err.cause = lastErr?.message
    throw err
}

async function callGemini(prompt, { apiKey, model, jsonMode }) {
    const generationConfig = {
        temperature: 0.6,
        maxOutputTokens: 8192,
    }
    if (jsonMode) generationConfig.responseMimeType = 'application/json'

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig,
            }),
        }
    )

    const data = await response.json()
    return { response, data }
}

/**
 * Call one model with retries on transient Google errors (503, 429, etc.).
 */
async function callGeminiResilient(prompt, { apiKey, model }) {
    let lastFailure = null

    for (let attempt = 0; attempt < MAX_RETRIES_PER_MODEL; attempt++) {
        let jsonMode = true
        let { response, data } = await callGemini(prompt, { apiKey, model, jsonMode })

        if (!response.ok) {
            const msg = data?.error?.message || ''
            if (response.status === 400 && /responseMimeType|json/i.test(msg)) {
                jsonMode = false
                ;({ response, data } = await callGemini(prompt, { apiKey, model, jsonMode: false }))
            }
        }

        if (response.ok) {
            return { response, data, model }
        }

        const status = response.status
        const msg = data?.error?.message || `Gemini API error (${status})`
        lastFailure = { status, msg, model }

        if (RETRYABLE_STATUSES.has(status) && attempt < MAX_RETRIES_PER_MODEL - 1) {
            const delay = 600 * Math.pow(2, attempt) + Math.floor(Math.random() * 300)
            await sleep(delay)
            continue
        }

        break
    }

    const err = new Error(lastFailure?.msg || 'Gemini request failed')
    err.status = lastFailure?.status || 500
    err.model = model
    throw err
}

function parseGeminiSuccess(data) {
    const finishReason = data?.candidates?.[0]?.finishReason
    const raw = extractText(data)

    if (!raw) {
        const err = new Error('Empty response from AI')
        err.raw = JSON.stringify(data?.promptFeedback || data).slice(0, 200)
        throw err
    }

    if (finishReason === 'MAX_TOKENS') {
        const err = new Error('AI response was cut off (too long). Try a shorter search term.')
        err.raw = raw.slice(0, 300)
        throw err
    }

    return parseJsonLoose(raw)
}

export async function generateFromPrompt(prompt, { apiKey, model = DEFAULT_MODEL } = {}) {
    if (!apiKey) throw new Error('API key not configured on server')
    if (!prompt) throw new Error('Prompt is required')

    const models = modelChain(model)
    const failures = []

    for (const tryModel of models) {
        try {
            const { data } = await callGeminiResilient(prompt, { apiKey, model: tryModel })
            return parseGeminiSuccess(data)
        } catch (e) {
            failures.push({ model: tryModel, status: e.status, message: e.message })
            const retryable = !e.status || RETRYABLE_STATUSES.has(e.status)
            if (!retryable) throw e
        }
    }

    const last = failures[failures.length - 1]
    const err = new Error(
        last?.status === 503
            ? 'Google AI is temporarily overloaded (503). Please wait a minute and try again.'
            : last?.message || 'All AI models failed. Please try again later.'
    )
    err.status = last?.status && last.status >= 400 && last.status < 600 ? last.status : 503
    err.attempts = failures
    throw err
}

export function getGeminiConfig() {
    return {
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    }
}
