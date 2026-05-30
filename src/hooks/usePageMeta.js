import { useEffect } from 'react'
import { applyPageMeta } from '../utils/seo.js'

/**
 * Updates document title and SEO meta tags for the current route.
 * @param {{ title?: string, description?: string, path?: string, image?: string, noIndex?: boolean }} meta
 */
export function usePageMeta(meta) {
    const { title, description, path, image, noIndex } = meta

    useEffect(() => {
        applyPageMeta({ title, description, path, image, noIndex })
    }, [title, description, path, image, noIndex])
}
