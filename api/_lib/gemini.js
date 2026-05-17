const DEFAULT_MODEL = 'gemini-2.5-flash'

/**
 * Call Gemini generateContent and parse JSON from the response text.
 * Shared by Vercel serverless and Vite dev middleware.
 */
export async function generateFromPrompt(prompt, { apiKey, model = DEFAULT_MODEL } = {}) {
    if (!apiKey) {
        throw new Error('API key not configured on server')
    }

    if (!prompt) {
        throw new Error('Prompt is required')
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.75,
                    maxOutputTokens: 3000,
                },
            }),
        }
    )

    const data = await response.json()

    if (!response.ok) {
        const msg = data?.error?.message || `Gemini API error (${response.status})`
        const err = new Error(msg)
        err.status = response.status
        throw err
    }

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    const clean = raw
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim()

    const start = clean.indexOf('{')
    const end = clean.lastIndexOf('}')

    if (start === -1 || end === -1) {
        const err = new Error('No JSON found in AI response')
        err.raw = clean.slice(0, 200)
        throw err
    }

    const jsonStr = clean.slice(start, end + 1)

    try {
        return JSON.parse(jsonStr)
    } catch {
        const err = new Error('Failed to parse AI response as JSON')
        err.raw = jsonStr.slice(0, 300)
        throw err
    }
}

export function getGeminiConfig() {
    return {
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    }
}
