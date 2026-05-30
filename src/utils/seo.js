export const SITE_NAME = 'Path AI'
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://roadmap-ai-sooty.vercel.app'
export const DEFAULT_TITLE = `${SITE_NAME} — AI Learning Roadmaps`
export const DEFAULT_DESCRIPTION =
    'Type any skill and get a structured AI-powered learning roadmap with phases, YouTube video links, and career guidance. Free to use.'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

function setMeta(attr, key, content) {
    if (content == null || content === '') return
    let el = document.head.querySelector(`meta[${attr}="${key}"]`)
    if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
    }
    el.setAttribute('content', content)
}

function setCanonical(href) {
    let el = document.head.querySelector('link[rel="canonical"]')
    if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        document.head.appendChild(el)
    }
    el.setAttribute('href', href)
}

/** @param {{ title?: string, description?: string, path?: string, image?: string, noIndex?: boolean }} options */
export function applyPageMeta(options = {}) {
    const title = options.title || DEFAULT_TITLE
    const description = options.description || DEFAULT_DESCRIPTION
    const path = options.path ?? '/'
    const image = options.image || DEFAULT_OG_IMAGE
    const canonical = path.startsWith('http') ? path : `${SITE_URL}${path}`

    document.title = title

    setMeta('name', 'description', description)
    setMeta('name', 'robots', options.noIndex ? 'noindex, nofollow' : 'index, follow')

    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', image)

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image)

    setCanonical(canonical)
}

export function buildTitle(pageTitle) {
    if (!pageTitle) return DEFAULT_TITLE
    return `${pageTitle} | ${SITE_NAME}`
}

export function truncateDescription(text, max = 160) {
    if (!text) return DEFAULT_DESCRIPTION
    const clean = text.replace(/\s+/g, ' ').trim()
    if (clean.length <= max) return clean
    return `${clean.slice(0, max - 1).trim()}…`
}
