import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { generateFromPrompt } from './api/_lib/gemini.js'

function devApiGeneratePlugin(env) {
    return {
        name: 'dev-api-generate',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (req.url !== '/api/generate' || req.method !== 'POST') {
                    return next()
                }

                let body = ''
                req.on('data', chunk => { body += chunk })
                req.on('end', async () => {
                    try {
                        const { prompt } = JSON.parse(body || '{}')
                        const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY
                        const model = env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash'

                        if (!apiKey) {
                            res.statusCode = 500
                            res.setHeader('Content-Type', 'application/json')
                            res.end(JSON.stringify({
                                error: 'GEMINI_API_KEY missing. Add it to .env in the project root.',
                            }))
                            return
                        }

                        const parsed = await generateFromPrompt(prompt, { apiKey, model })
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify(parsed))
                    } catch (err) {
                        const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500
                        res.statusCode = status
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({
                            error: err.message,
                            ...(err.raw ? { raw: err.raw } : {}),
                        }))
                    }
                })
                req.on('error', () => {
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ error: 'Failed to read request body' }))
                })
            })
        },
    }
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [react(), devApiGeneratePlugin(env)],
    }
})
