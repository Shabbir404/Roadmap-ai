// ─── Keys ─────────────────────────────────────────────────
function roadmapKey(topic) {
    return `roadmap__${topic.toLowerCase().replace(/\s+/g, '_')}`
}

const INDEX_KEY = 'roadmap__index' // list of all saved topics

// ─── Index (list of all saved roadmaps) ───────────────────
function getIndex() {
    try {
        return JSON.parse(localStorage.getItem(INDEX_KEY)) || []
    } catch { return [] }
}

function addToIndex(topic) {
    const index = getIndex()
    if (!index.includes(topic)) {
        index.push(topic)
        localStorage.setItem(INDEX_KEY, JSON.stringify(index))
    }
}

function removeFromIndex(topic) {
    const index = getIndex().filter(t => t !== topic)
    localStorage.setItem(INDEX_KEY, JSON.stringify(index))
}

// ─── Save ─────────────────────────────────────────────────
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
    addToIndex(topic)
}

// ─── Get one ──────────────────────────────────────────────
export function getRoadmap(topic) {
    try {
        const raw = localStorage.getItem(roadmapKey(topic))
        return raw ? JSON.parse(raw) : null
    } catch { return null }
}

// ─── Get all ──────────────────────────────────────────────
export function getAllRoadmaps() {
    return getIndex().map(topic => getRoadmap(topic)).filter(Boolean)
}

// ─── Delete ───────────────────────────────────────────────
export function deleteRoadmap(topic) {
    localStorage.removeItem(roadmapKey(topic))
    removeFromIndex(topic)
}

// ─── Progress ─────────────────────────────────────────────
export function saveProgress(topic, progress) {
    const entry = getRoadmap(topic)
    if (!entry) return
    entry.progress = progress
    localStorage.setItem(roadmapKey(topic), JSON.stringify(entry))
}

export function getProgress(topic) {
    return getRoadmap(topic)?.progress || {}
}

// ─── 24hr cooldown check ──────────────────────────────────
const COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24 hours

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

// ─── Human readable date ──────────────────────────────────
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