import { generateFromPrompt, getGeminiConfig } from './_lib/gemini.js'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { prompt } = req.body

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' })
    }

    const { apiKey, model } = getGeminiConfig()

    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured on server' })
    }

    try {
        const parsed = await generateFromPrompt(prompt, { apiKey, model })
        return res.status(200).json(parsed)
    } catch (err) {
        const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500
        return res.status(status).json({
            error: err.message,
            ...(err.raw ? { raw: err.raw } : {}),
        })
    }
}
