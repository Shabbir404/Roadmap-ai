import { supabase } from './supabase.js'

// ─── Key helpers (for localStorage fallback) ──────────────
function roadmapKey(topic) {
    return `roadmap__${topic.toLowerCase().trim().replace(/\s+/g, '_')}`
}

function careerKey(topic, career) {
    return `career__${topic.toLowerCase().trim().replace(/\s+/g, '_')}__${career.toLowerCase().trim().replace(/\s+/g, '_')}`
}

const INDEX_KEY = 'roadmap__index'
const CAREER_INDEX_KEY = 'career__index'

function getIndex(key) {
    try { return JSON.parse(localStorage.getItem(key)) || [] }
    catch { return [] }
}

function addToIndex(indexKey, value) {
    const index = getIndex(indexKey)
    if (!index.includes(value)) {
        index.push(value)
        localStorage.setItem(indexKey, JSON.stringify(index))
    }
}

function removeFromIndex(indexKey, value) {
    const index = getIndex(indexKey).filter(v => v !== value)
    localStorage.setItem(indexKey, JSON.stringify(index))
}

// ─── Get current user ─────────────────────────────────────
async function getUser() {
    // First try to get session from URL (after OAuth redirect)
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) console.error('getSession error:', error)
    if (session?.user) return session.user

    // Fallback — refresh session
    const { data: { user } } = await supabase.auth.getUser()
    return user || null
}
// ─── Save roadmap ─────────────────────────────────────────
export async function saveRoadmap(topic, data) {
    const user = await getUser()

    if (user) {
        // Save to Supabase
        await supabase.from('roadmaps').upsert({
            user_id: user.id,
            topic,
            data,
            last_generated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,topic' })
    } else {
        // Fallback to localStorage
        const key = roadmapKey(topic)
        const existing = getLocalRoadmap(topic)
        const entry = {
            topic, data,
            savedAt: existing?.savedAt || Date.now(),
            lastGeneratedAt: Date.now(),
            progress: existing?.progress || {},
        }
        localStorage.setItem(key, JSON.stringify(entry))
        addToIndex(INDEX_KEY, topic)
    }
}

// ─── Get one roadmap ──────────────────────────────────────
export async function getRoadmap(topic) {
    const user = await getUser()

    if (user) {
        const { data } = await supabase
            .from('roadmaps')
            .select('*')
            .eq('user_id', user.id)
            .eq('topic', topic)
            .single()
        return data || null
    } else {
        return getLocalRoadmap(topic)
    }
}

// ─── Get all roadmaps ─────────────────────────────────────
export async function getAllRoadmaps() {
    const user = await getUser()

    if (user) {
        const { data } = await supabase
            .from('roadmaps')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        return data || []
    } else {
        return getIndex(INDEX_KEY)
            .map(topic => getLocalRoadmap(topic))
            .filter(Boolean)
    }
}

// ─── Delete roadmap ───────────────────────────────────────
export async function deleteRoadmap(topic) {
    const user = await getUser()

    if (user) {
        await supabase
            .from('roadmaps')
            .delete()
            .eq('user_id', user.id)
            .eq('topic', topic)
        // also delete progress
        await supabase
            .from('progress')
            .delete()
            .eq('user_id', user.id)
            .eq('topic', topic)
        // delete career cache
        await supabase
            .from('career_cache')
            .delete()
            .eq('user_id', user.id)
            .eq('topic', topic)
    } else {
        localStorage.removeItem(roadmapKey(topic))
        removeFromIndex(INDEX_KEY, topic)
    }
}

// ─── Progress ─────────────────────────────────────────────
export async function saveProgress(topic, progress) {
    const user = await getUser()

    if (user) {
        await supabase.from('progress').upsert({
            user_id: user.id,
            topic,
            done_keys: progress,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,topic' })
    } else {
        // localStorage fallback
        persistLocalProgress(topic, progress)
    }
}

export async function getProgress(topic) {
    const user = await getUser()

    if (user) {
        const { data } = await supabase
            .from('progress')
            .select('done_keys')
            .eq('user_id', user.id)
            .eq('topic', topic)
            .single()
        return data?.done_keys || {}
    } else {
        return loadLocalProgress(topic)
    }
}

// ─── Career cache ─────────────────────────────────────────
export async function saveCareerRoadmap(topic, career, data) {
    const user = await getUser()

    if (user) {
        await supabase.from('career_cache').upsert({
            user_id: user.id,
            topic,
            career,
            data,
        }, { onConflict: 'user_id,topic,career' })
    } else {
        const key = careerKey(topic, career)
        localStorage.setItem(key, JSON.stringify({ topic, career, data, savedAt: Date.now() }))
    }
}

export async function getCareerRoadmap(topic, career) {
    const user = await getUser()

    if (user) {
        const { data } = await supabase
            .from('career_cache')
            .select('data')
            .eq('user_id', user.id)
            .eq('topic', topic)
            .eq('career', career)
            .single()
        return data ? { data: data.data } : null
    } else {
        try {
            const raw = localStorage.getItem(careerKey(topic, career))
            return raw ? JSON.parse(raw) : null
        } catch { return null }
    }
}

// ─── Rate limiting ────────────────────────────────────────
export async function getGenerationsToday() {
    const user = await getUser()
    const today = new Date().toISOString().split('T')[0]

    if (user) {
        const { data } = await supabase
            .from('generations')
            .select('count')
            .eq('user_id', user.id)
            .eq('date', today)
            .single()
        return data?.count || 0
    } else {
        // localStorage fallback
        try {
            const raw = localStorage.getItem('daily_generation_limit')
            if (!raw) return 0
            const { date, count } = JSON.parse(raw)
            const todayKey = new Date().toLocaleDateString()
            if (date !== todayKey) return 0
            return count
        } catch { return 0 }
    }
}

export async function incrementGeneration() {
    const user = await getUser()
    const today = new Date().toISOString().split('T')[0]

    if (user) {
        const current = await getGenerationsToday()
        await supabase.from('generations').upsert({
            user_id: user.id,
            date: today,
            count: current + 1,
        }, { onConflict: 'user_id,date' })
    } else {
        try {
            const todayKey = new Date().toLocaleDateString()
            const current = await getGenerationsToday()
            localStorage.setItem('daily_generation_limit', JSON.stringify({
                date: todayKey,
                count: current + 1,
            }))
        } catch { }
    }
}

export async function canGenerate() {
    const count = await getGenerationsToday()
    return count < 3
}

export async function generationsLeft() {
    const count = await getGenerationsToday()
    return Math.max(0, 3 - count)
}

// ─── Local helpers (used as fallback) ─────────────────────
function getLocalRoadmap(topic) {
    try {
        const raw = localStorage.getItem(roadmapKey(topic))
        return raw ? JSON.parse(raw) : null
    } catch { return null }
}

function progressKey(topic) {
    return `progress__${topic.toLowerCase().trim().replace(/\s+/g, '_')}`
}

function loadLocalProgress(topic) {
    try {
        const raw = localStorage.getItem(progressKey(topic))
        return raw ? JSON.parse(raw) : {}
    } catch { return {} }
}

function persistLocalProgress(topic, progress) {
    try {
        localStorage.setItem(progressKey(topic), JSON.stringify(progress))
    } catch { }
}

export function getStandaloneProgress(topic) {
    return loadLocalProgress(topic)
}

// ─── Time helpers ─────────────────────────────────────────
export function timeAgo(timestamp) {
    if (!timestamp) return ''
    const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp)
    const diff = Date.now() - date.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins} min ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}

export function resetTime() {
    const now = new Date()
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0)
    const diff = midnight - now
    const hours = Math.floor(diff / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

export async function canRefresh(topic) {
    const user = await getUser()
    const COOLDOWN_MS = 24 * 60 * 60 * 1000

    if (user) {
        const { data } = await supabase
            .from('roadmaps')
            .select('last_generated_at')
            .eq('user_id', user.id)
            .eq('topic', topic)
            .single()
        if (!data) return true
        return Date.now() - new Date(data.last_generated_at).getTime() > COOLDOWN_MS
    } else {
        try {
            const raw = localStorage.getItem(roadmapKey(topic))
            if (!raw) return true
            const entry = JSON.parse(raw)
            return Date.now() - entry.lastGeneratedAt > COOLDOWN_MS
        } catch { return true }
    }
}

export async function timeUntilRefresh(topic) {
    const user = await getUser()
    const COOLDOWN_MS = 24 * 60 * 60 * 1000

    if (user) {
        const { data } = await supabase
            .from('roadmaps')
            .select('last_generated_at')
            .eq('user_id', user.id)
            .eq('topic', topic)
            .single()
        if (!data) return null
        const diff = COOLDOWN_MS - (Date.now() - new Date(data.last_generated_at).getTime())
        if (diff <= 0) return null
        const hours = Math.floor(diff / 3600000)
        const mins = Math.floor((diff % 3600000) / 60000)
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
    } else {
        try {
            const raw = localStorage.getItem(roadmapKey(topic))
            if (!raw) return null
            const entry = JSON.parse(raw)
            const diff = COOLDOWN_MS - (Date.now() - entry.lastGeneratedAt)
            if (diff <= 0) return null
            const hours = Math.floor(diff / 3600000)
            const mins = Math.floor((diff % 3600000) / 60000)
            return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
        } catch { return null }
    }
}