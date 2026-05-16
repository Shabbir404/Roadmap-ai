const LIMIT_KEY = 'daily_generation_limit'
const MAX_PER_DAY = 3

function getTodayKey() {
    const d = new Date()
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function getGenerationsToday() {
    try {
        const raw = localStorage.getItem(LIMIT_KEY)
        if (!raw) return 0
        const { date, count } = JSON.parse(raw)
        if (date !== getTodayKey()) return 0 // new day — reset
        return count
    } catch { return 0 }
}

export function incrementGeneration() {
    const count = getGenerationsToday() + 1
    localStorage.setItem(LIMIT_KEY, JSON.stringify({
        date: getTodayKey(),
        count,
    }))
}

export function canGenerate() {
    return getGenerationsToday() < MAX_PER_DAY
}

export function generationsLeft() {
    return Math.max(0, MAX_PER_DAY - getGenerationsToday())
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