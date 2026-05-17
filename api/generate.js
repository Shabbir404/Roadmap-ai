export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { prompt } = req.body

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' })
    }

    const API_KEY = process.env.GEMINI_API_KEY

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured on server' })
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
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
            return res.status(response.status).json({
                error: data?.error?.message || 'Gemini API error'
            })
        }

        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim()
        const start = clean.indexOf('{')
        const end = clean.lastIndexOf('}')

        if (start === -1 || end === -1) {
            return res.status(500).json({ error: 'No JSON found in response' })
        }

        const parsed = JSON.parse(clean.slice(start, end + 1))
        return res.status(200).json(parsed)

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}