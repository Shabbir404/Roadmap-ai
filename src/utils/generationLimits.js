const ANON_KEY = 'pathai_anon_quota'
const AUTH_PREFIX = 'pathai_auth_quota_'

export const MAX_ANON_ROADMAPS = 1
export const MAX_AUTH_ROADMAPS = 2
export const TOTAL_FREE_ROADMAPS = MAX_ANON_ROADMAPS + MAX_AUTH_ROADMAPS

const QUOTA_EVENT = 'pathai-quota-update'

function readAnon() {
    try {
        const raw = localStorage.getItem(ANON_KEY)
        if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return { roadmaps: 0 }
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

export function notifyQuotaUpdate() {
    window.dispatchEvent(new CustomEvent(QUOTA_EVENT))
}

/** Clear legacy daily limit keys that caused false “3 used” errors. */
export function migrateLegacyLimits() {
    try {
        localStorage.removeItem('daily_generation_limit')
        const anon = readAnon()
        if ('careers' in anon) {
            delete anon.careers
            writeAnon(anon)
        }
    } catch { /* ignore */ }
}

export function canGenerateRoadmap(user) {
    migrateLegacyLimits()
    if (!user) return readAnon().roadmaps < MAX_ANON_ROADMAPS
    return readAuth(user.id).roadmaps < MAX_AUTH_ROADMAPS
}

export function incrementRoadmap(user) {
    if (!user) {
        const anon = readAnon()
        anon.roadmaps = Math.min(MAX_ANON_ROADMAPS, anon.roadmaps + 1)
        writeAnon(anon)
    } else {
        const auth = readAuth(user.id)
        auth.roadmaps = Math.min(MAX_AUTH_ROADMAPS, auth.roadmaps + 1)
        writeAuth(user.id, auth)
    }
    notifyQuotaUpdate()
}

function totalUsed(anon, authUsed = 0) {
    return anon.roadmaps + authUsed
}

export async function getRoadmapQuota(user) {
    migrateLegacyLimits()
    const anon = readAnon()

    if (!user) {
        const remaining = Math.max(0, MAX_ANON_ROADMAPS - anon.roadmaps)
        const used = totalUsed(anon)
        return {
            remaining,
            max: MAX_ANON_ROADMAPS,
            totalMax: TOTAL_FREE_ROADMAPS,
            totalUsed: used,
            totalRemaining: Math.max(0, TOTAL_FREE_ROADMAPS - used),
            used: anon.roadmaps,
            needsSignIn: anon.roadmaps >= MAX_ANON_ROADMAPS,
            fullyExhausted: anon.roadmaps >= MAX_ANON_ROADMAPS,
            label: remaining > 0
                ? '1 free roadmap · no login needed'
                : 'Sign in to generate more',
            shortLabel: remaining > 0 ? '1 free · no login' : 'Sign in for 2 more',
            hint: remaining > 0
                ? 'Generate your first roadmap free — no account required.'
                : 'You used your free roadmap. Sign in to unlock 2 more.',
        }
    }

    const auth = readAuth(user.id)
    const authRemaining = Math.max(0, MAX_AUTH_ROADMAPS - auth.roadmaps)
    const used = totalUsed(anon, auth.roadmaps)
    const totalRemaining = Math.max(0, TOTAL_FREE_ROADMAPS - used)

    return {
        remaining: authRemaining,
        max: MAX_AUTH_ROADMAPS,
        totalMax: TOTAL_FREE_ROADMAPS,
        totalUsed: used,
        totalRemaining,
        used: auth.roadmaps,
        anonUsed: anon.roadmaps,
        needsSignIn: false,
        fullyExhausted: auth.roadmaps >= MAX_AUTH_ROADMAPS,
        label: authRemaining > 0
            ? `${authRemaining} free roadmap${authRemaining !== 1 ? 's' : ''} left`
            : 'No generations left',
        shortLabel: authRemaining > 0
            ? `${authRemaining} of 2 left`
            : 'Limit reached',
        hint: authRemaining > 0
            ? `${used} of ${TOTAL_FREE_ROADMAPS} free roadmaps used. Templates & career paths are unlimited.`
            : `All ${TOTAL_FREE_ROADMAPS} free roadmaps used. Browse templates or saved roadmaps anytime.`,
    }
}

export function getQuotaEventName() {
    return QUOTA_EVENT
}
