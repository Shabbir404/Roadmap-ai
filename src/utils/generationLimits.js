const ANON_KEY = 'pathai_anon_quota'
const AUTH_PREFIX = 'pathai_auth_quota_'

const MAX_ANON_ROADMAPS = 1
const MAX_ANON_CAREERS = 1
const MAX_AUTH_ROADMAPS = 2

function readAnon() {
    try {
        const raw = localStorage.getItem(ANON_KEY)
        if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return { roadmaps: 0, careers: 0 }
}

function writeAnon(data) {
    localStorage.setItem(ANON_KEY, JSON.stringify(data))
}

function readAuth(userId) {
    try {
        const raw = localStorage.getItem(AUTH_PREFIX + userId)
        if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return { roadmaps: 0 }
}

function writeAuth(userId, data) {
    localStorage.setItem(AUTH_PREFIX + userId, JSON.stringify(data))
}

/** Clear legacy daily limit keys that caused false “3 used” errors. */
export function migrateLegacyLimits() {
    try {
        localStorage.removeItem('daily_generation_limit')
    } catch { /* ignore */ }
}

export function canGenerateRoadmap(user) {
    migrateLegacyLimits()
    if (!user) return readAnon().roadmaps < MAX_ANON_ROADMAPS
    return readAuth(user.id).roadmaps < MAX_AUTH_ROADMAPS
}

export function canGenerateCareer(user) {
    if (user) return true
    migrateLegacyLimits()
    return readAnon().careers < MAX_ANON_CAREERS
}

export function incrementRoadmap(user) {
    if (!user) {
        const anon = readAnon()
        anon.roadmaps = Math.min(MAX_ANON_ROADMAPS, anon.roadmaps + 1)
        writeAnon(anon)
        return
    }
    const auth = readAuth(user.id)
    auth.roadmaps = Math.min(MAX_AUTH_ROADMAPS, auth.roadmaps + 1)
    writeAuth(user.id, auth)
}

export function incrementCareer(user) {
    if (user) return
    const anon = readAnon()
    anon.careers = Math.min(MAX_ANON_CAREERS, anon.careers + 1)
    writeAnon(anon)
}

export async function getRoadmapQuota(user) {
    migrateLegacyLimits()
    const anon = readAnon()

    if (!user) {
        const remaining = Math.max(0, MAX_ANON_ROADMAPS - anon.roadmaps)
        return {
            remaining,
            max: MAX_ANON_ROADMAPS,
            used: anon.roadmaps,
            needsSignIn: anon.roadmaps >= MAX_ANON_ROADMAPS,
            fullyExhausted: anon.roadmaps >= MAX_ANON_ROADMAPS,
            label: remaining > 0 ? `${remaining} free roadmap` : 'Sign in for 2 more',
        }
    }

    const auth = readAuth(user.id)
    const authRemaining = Math.max(0, MAX_AUTH_ROADMAPS - auth.roadmaps)

    return {
        remaining: authRemaining,
        max: MAX_AUTH_ROADMAPS,
        used: auth.roadmaps,
        anonUsed: anon.roadmaps,
        needsSignIn: false,
        fullyExhausted: auth.roadmaps >= MAX_AUTH_ROADMAPS,
        label: authRemaining > 0
            ? `${authRemaining} of 2 roadmaps left`
            : 'No free roadmaps left',
    }
}

export function getCareerQuota(user) {
    if (user) return { remaining: Infinity, needsSignIn: false, label: 'Unlimited career paths' }
    const anon = readAnon()
    const remaining = Math.max(0, MAX_ANON_CAREERS - anon.careers)
    return {
        remaining,
        needsSignIn: anon.careers >= MAX_ANON_CAREERS,
        label: remaining > 0 ? '1 free career path' : 'Sign in for unlimited careers',
    }
}
