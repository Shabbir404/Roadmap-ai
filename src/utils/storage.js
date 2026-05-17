import { supabase } from './supabase.js'

// ─── Key helpers ──────────────────────────────────────────
function roadmapKey(topic) {
    return `roadmap__${topic.toLowerCase().trim().replace(/\s+/g, '_')}`
}

function careerKey(topic, career) {
    return `career__${topic.toLowerCase().trim().replace(/\s+/g, '_')}__${career.toLowerCase().trim().replace(/\s+/g, '_')}`
}

function progressKey(topic) {
    return `progress__${topic.toLowerCase().trim().replace(/\s+/g, '_')}`
}

const INDEX_KEY = 'roadmap__index'

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
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) return session.user
    const { data: { user } } = await supabase.auth.getUser()
    return user || null
}

// ─── Local helpers ────────────────────────────────────────
function getLocalRoadmap(topic) {
    try {
        const raw = localStorage.getItem(roadmapKey(topic))
        return raw ? JSON.parse(raw) : null
    } catch { return null }
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

// ─── Roadmap local save ───────────────────────────────────
export function saveRoadmapLocal(topic, data, source = 'ai') {
    const key = roadmapKey(topic)
    const existing = getLocalRoadmap(topic)
    const entry = {
        topic,
        data,
        savedAt: existing?.savedAt || Date.now(),
        lastGeneratedAt: Date.now(),
        source,
        progress: existing?.progress || {},
    }
    localStorage.setItem(key, JSON.stringify(entry))
    addToIndex(INDEX_KEY, topic)
}

export function hasLocalRoadmap(topic) {
    return !!getLocalRoadmap(topic)
}

// ─── Save roadmap ─────────────────────────────────────────
export async function saveRoadmap(topic, data) {
    // Always save locally first
    saveRoadmapLocal(topic, data)

    const user = await getUser()
    if (!user) return

    const { error } = await supabase.from('roadmaps').upsert({
        user_id: user.id,
        topic,
        data,
        last_generated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,topic' })

    if (error) console.error('saveRoadmap cloud error:', error.message)
}

// ─── Get one roadmap ──────────────────────────────────────
export async function getRoadmap(topic) {
    const user = await getUser()

    if (user) {
        const { data, error } = await supabase
            .from('roadmaps')
            .select('*')
            .eq('user_id', user.id)
            .eq('topic', topic)
            .maybeSingle()

        if (!error && data) return data
    }

    // Fallback to localStorage
    const local = getLocalRoadmap(topic)
    if (!local) return null
    if (local.data) return local
    return { topic: local.topic, data: local, lastGeneratedAt: local.lastGeneratedAt }
}

// ─── Get all roadmaps ─────────────────────────────────────
export async function getAllRoadmaps() {
    const user = await getUser()

    if (user) {
        const { data, error } = await supabase
            .from('roadmaps')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (!error && data) {
            // Merge with any local-only roadmaps not yet in cloud
            const cloudTopics = new Set(data.map(r => r.topic))
            const localOnly = getIndex(INDEX_KEY)
                .filter(t => !cloudTopics.has(t))
                .map(t => getLocalRoadmap(t))
                .filter(Boolean)
            return [...data, ...localOnly]
        }
    }

    return getIndex(INDEX_KEY)
        .map(t => getLocalRoadmap(t))
        .filter(Boolean)
}

// ─── Delete roadmap ───────────────────────────────────────
export async function deleteRoadmap(topic) {
    localStorage.removeItem(roadmapKey(topic))
    localStorage.removeItem(progressKey(topic))
    removeFromIndex(INDEX_KEY, topic)

    const user = await getUser()
    if (!user) return

    await supabase.from('roadmaps').delete().eq('user_id', user.id).eq('topic', topic)
    await supabase.from('progress').delete().eq('user_id', user.id).eq('topic', topic)
    await supabase.from('career_cache').delete().eq('user_id', user.id).eq('topic', topic)
}

// ─── Progress ─────────────────────────────────────────────
export async function saveProgress(topic, progress) {
    // Always save locally as backup
    persistLocalProgress(topic, progress)

    const user = await getUser()
    if (!user) return

    const { error } = await supabase.from('progress').upsert({
        user_id: user.id,
        topic,
        done_keys: progress,
        updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,topic' })

    if (error) console.error('saveProgress error:', error.message)
}

export async function getProgress(topic) {
    const user = await getUser()

    if (user) {
        const { data, error } = await supabase
            .from('progress')
            .select('done_keys')
            .eq('user_id', user.id)
            .eq('topic', topic)
            .maybeSingle()

        if (!error && data?.done_keys) return data.done_keys
    }

    return loadLocalProgress(topic)
}

// ─── Career cache ─────────────────────────────────────────
function getLocalCareerRoadmap(topic, career) {
    try {
        const raw = localStorage.getItem(careerKey(topic, career))
        return raw ? JSON.parse(raw) : null
    } catch { return null }
}

export function saveCareerRoadmapLocal(topic, career, data) {
    localStorage.setItem(careerKey(topic, career), JSON.stringify({
        topic, career, data, generatedBy: 'ai', savedAt: Date.now(),
    }))
}

export async function saveCareerRoadmap(topic, career, data) {
    saveCareerRoadmapLocal(topic, career, data)

    const user = await getUser()
    if (!user) return

    const { error } = await supabase.from('career_cache').upsert({
        user_id: user.id, topic, career, data,
    }, { onConflict: 'user_id,topic,career' })

    if (error) console.error('saveCareerRoadmap error:', error.message)
}

export async function getCareerRoadmap(topic, career) {
    const user = await getUser()

    if (user) {
        const { data, error } = await supabase
            .from('career_cache')
            .select('data')
            .eq('user_id', user.id)
            .eq('topic', topic)
            .eq('career', career)
            .maybeSingle()

        if (!error && data?.data) return { data: data.data, generatedBy: 'ai' }
    }

    return getLocalCareerRoadmap(topic, career)
}

export function isAiCareerCache(cached) {
    return !!(cached?.data && cached.generatedBy === 'ai')
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
            .maybeSingle()
        return data?.count || 0
    }

    try {
        const raw = localStorage.getItem('daily_generation_limit')
        if (!raw) return 0
        const { date, count } = JSON.parse(raw)
        const todayKey = new Date().toLocaleDateString()
        if (date !== todayKey) return 0
        return count
    } catch { return 0 }
}

export async function canGenerate() {
    const count = await getGenerationsToday()
    return count < 3
}

export async function generationsLeft() {
    const count = await getGenerationsToday()
    return Math.max(0, 3 - count)
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
        return
    }

    try {
        const todayKey = new Date().toLocaleDateString()
        const current = await getGenerationsToday()
        localStorage.setItem('daily_generation_limit', JSON.stringify({
            date: todayKey,
            count: current + 1,
        }))
    } catch { }
}

// ─── Refresh cooldown ─────────────────────────────────────
const COOLDOWN_MS = 24 * 60 * 60 * 1000

export async function canRefresh(topic) {
    const user = await getUser()

    if (user) {
        const { data } = await supabase
            .from('roadmaps')
            .select('last_generated_at')
            .eq('user_id', user.id)
            .eq('topic', topic)
            .maybeSingle()
        if (!data) return true
        return Date.now() - new Date(data.last_generated_at).getTime() > COOLDOWN_MS
    }

    try {
        const raw = localStorage.getItem(roadmapKey(topic))
        if (!raw) return true
        const entry = JSON.parse(raw)
        return Date.now() - (entry.lastGeneratedAt || 0) > COOLDOWN_MS
    } catch { return true }
}

export async function timeUntilRefresh(topic) {
    const user = await getUser()
    let lastGenAt = null

    if (user) {
        const { data } = await supabase
            .from('roadmaps')
            .select('last_generated_at')
            .eq('user_id', user.id)
            .eq('topic', topic)
            .maybeSingle()
        if (data?.last_generated_at) lastGenAt = new Date(data.last_generated_at).getTime()
    } else {
        try {
            const raw = localStorage.getItem(roadmapKey(topic))
            if (raw) lastGenAt = JSON.parse(raw).lastGeneratedAt
        } catch { }
    }

    if (!lastGenAt) return null
    const diff = COOLDOWN_MS - (Date.now() - lastGenAt)
    if (diff <= 0) return null
    const hours = Math.floor(diff / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
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