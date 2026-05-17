const DEFAULT_MODEL = 'gemini-2.5-flash'

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

/** Fix common model mistakes before JSON.parse */
function repairJsonString(str) {
    let s = stripFences(str)
    // Smart quotes → straight quotes
    s = s.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'")
    // Trailing commas
    s = s.replace(/,\s*([}\]])/g, '$1')
    return s
}

/** If truncated, close open brackets (best-effort). */
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

/**
 * Call Gemini generateContent and parse JSON from the response.
 */
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

export async function generateFromPrompt(prompt, { apiKey, model = DEFAULT_MODEL } = {}) {
    if (!apiKey) throw new Error('API key not configured on server')
    if (!prompt) throw new Error('Prompt is required')

    let { response, data } = await callGemini(prompt, { apiKey, model, jsonMode: true })

    if (!response.ok) {
        const msg = data?.error?.message || ''
        if (response.status === 400 && /responseMimeType|json/i.test(msg)) {
            ;({ response, data } = await callGemini(prompt, { apiKey, model, jsonMode: false }))
        }
    }

    if (!response.ok) {
        const msg = data?.error?.message || `Gemini API error (${response.status})`
        const err = new Error(msg)
        err.status = response.status
        throw err
    }

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

export function getGeminiConfig() {
    return {
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    }
}
