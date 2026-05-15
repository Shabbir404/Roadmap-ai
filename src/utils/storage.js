// ─── Keys ─────────────────────────────────────────────────
function roadmapKey(topic) {
    return `roadmap__${topic.toLowerCase().trim().replace(/\s+/g, '_')}`
}

function careerKey(topic, career) {
    return `career__${topic.toLowerCase().trim().replace(/\s+/g, '_')}__${career.toLowerCase().trim().replace(/\s+/g, '_')}`
}



const INDEX_KEY = 'roadmap__index'
const CAREER_INDEX_KEY = 'career__index'

// ─── Index helpers ─────────────────────────────────────────
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

// ─── Roadmap save/get/delete ───────────────────────────────
export function saveRoadmap(topic, data) {
    const key = roadmapKey(topic)
    const existing = getRoadmap(topic)
    const entry = {
        topic,
        data,
        savedAt: existing?.savedAt || Date.now(),
        lastGeneratedAt: Date.now(),
        progress: existing?.progress || {},
    }
    localStorage.setItem(key, JSON.stringify(entry))
    addToIndex(INDEX_KEY, topic)
}

export function getRoadmap(topic) {
    try {
        const raw = localStorage.getItem(roadmapKey(topic))
        return raw ? JSON.parse(raw) : null
    } catch { return null }
}

export function getAllRoadmaps() {
    return getIndex(INDEX_KEY)
        .map(topic => {
            const rm = getRoadmap(topic)
            if (!rm) return null
            // Read progress from standalone key so it stays in sync
            const progress = getStandaloneProgress(topic)
            return { ...rm, progress }
        })
        .filter(Boolean)
}

export function deleteRoadmap(topic) {
    localStorage.removeItem(roadmapKey(topic))
    removeFromIndex(INDEX_KEY, topic)
    // also delete all career caches for this topic
    getIndex(CAREER_INDEX_KEY)
        .filter(k => k.startsWith(topic.toLowerCase().trim().replace(/\s+/g, '_')))
        .forEach(k => {
            localStorage.removeItem(`career__${k}`)
            removeFromIndex(CAREER_INDEX_KEY, k)
        })
}

// ─── Progress ──────────────────────────────────────────────
export function saveProgress(topic, progress) {
    try {
        const key = roadmapKey(topic)
        const raw = localStorage.getItem(key)
        if (!raw) return
        const entry = JSON.parse(raw)
        entry.progress = progress
        localStorage.setItem(key, JSON.stringify(entry))
    } catch { }
}

export function getProgress(topic) {
    try {
        return getRoadmap(topic)?.progress || {}
    } catch { return {} }
}

// ─── Career roadmap cache ──────────────────────────────────
export function saveCareerRoadmap(topic, career, data) {
    const key = careerKey(topic, career)
    const entry = { topic, career, data, savedAt: Date.now() }
    localStorage.setItem(key, JSON.stringify(entry))
    addToIndex(CAREER_INDEX_KEY, `${topic.toLowerCase().trim().replace(/\s+/g, '_')}__${career.toLowerCase().trim().replace(/\s+/g, '_')}`)
}

export function getCareerRoadmap(topic, career) {
    try {
        const raw = localStorage.getItem(careerKey(topic, career))
        return raw ? JSON.parse(raw) : null
    } catch { return null }
}

// ─── 24hr cooldown ─────────────────────────────────────────
const COOLDOWN_MS = 24 * 60 * 60 * 1000

export function canRefresh(topic) {
    const entry = getRoadmap(topic)
    if (!entry) return true
    return Date.now() - entry.lastGeneratedAt > COOLDOWN_MS
}

export function timeUntilRefresh(topic) {
    const entry = getRoadmap(topic)
    if (!entry) return null
    const diff = COOLDOWN_MS - (Date.now() - entry.lastGeneratedAt)
    if (diff <= 0) return null
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

// ─── Time helper ───────────────────────────────────────────
export function timeAgo(timestamp) {
    const diff = Date.now() - timestamp
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins} min ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}
// ─── Standalone progress (used by useProgress hook) ────────
function progressKey(topic) {
    return `progress__${topic.toLowerCase().trim().replace(/\s+/g, '_')}`
}

export function getStandaloneProgress(topic) {
    try {
        const raw = localStorage.getItem(progressKey(topic))
        return raw ? JSON.parse(raw) : {}
    } catch { return {} }
}