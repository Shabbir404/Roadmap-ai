import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { getRoadmapQuota, getQuotaEventName, migrateLegacyLimits } from '../utils/generationLimits.js'

export default function QuotaBadge({ compact = false }) {
    const { user } = useAuth()
    const [quota, setQuota] = useState(null)

    const refresh = useCallback(async () => {
        migrateLegacyLimits()
        const q = await getRoadmapQuota(user)
        setQuota(q)
    }, [user])

    useEffect(() => {
        refresh()
    }, [refresh])

    useEffect(() => {
        const event = getQuotaEventName()
        window.addEventListener(event, refresh)
        return () => window.removeEventListener(event, refresh)
    }, [refresh])

    if (!quota) return null

    const variant = quota.fullyExhausted
        ? 'exhausted'
        : quota.needsSignIn
            ? 'signin'
            : 'available'

    const dots = Array.from({ length: quota.totalMax }, (_, i) => i < quota.totalUsed)

    return (
        <div
            className={`quota-badge quota-badge--${variant}${compact ? ' quota-badge--compact' : ''}`}
            title={quota.hint}
        >
            <div className="quota-badge-dots" aria-hidden="true">
                {dots.map((filled, i) => (
                    <span key={i} className={`quota-dot${filled ? ' quota-dot--used' : ''}`} />
                ))}
            </div>
            <div className="quota-badge-text">
                <span className="quota-badge-label">{compact ? quota.shortLabel : quota.label}</span>
                {!compact && (
                    <span className="quota-badge-sub">
                        {quota.totalUsed}/{quota.totalMax} roadmaps · careers & templates unlimited
                    </span>
                )}
            </div>
        </div>
    )
}
