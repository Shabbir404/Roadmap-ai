import { useState, useEffect, useCallback } from 'react'

// Standalone progress storage — doesn't depend on roadmap existing
function progressKey(id) {
    return `progress__${id.toLowerCase().trim().replace(/\s+/g, '_')}`
}

function loadProgress(topic) {
    try {
        const raw = localStorage.getItem(progressKey(topic))
        return raw ? JSON.parse(raw) : {}
    } catch { return {} }
}

function persistProgress(topic, progress) {
    try {
        localStorage.setItem(progressKey(topic), JSON.stringify(progress))
    } catch { }
}

export function useProgress(topic, phases) {
    const [done, setDone] = useState({})

    // Load on topic change
    useEffect(() => {
        if (!topic) return
        setDone(loadProgress(topic))
    }, [topic])

    const toggle = useCallback((phaseId, topicId) => {
        setDone(prev => {
            const key = `${phaseId}_${topicId}`
            const next = { ...prev }
            if (next[key]) delete next[key]
            else next[key] = true
            // Save immediately inside toggle — no useEffect delay
            persistProgress(topic, next)
            return next
        })
    }, [topic])

    const isTopicDone = useCallback((phaseId, topicId) => {
        return !!done[`${phaseId}_${topicId}`]
    }, [done])

    const totalTopics = phases?.reduce((sum, p) => sum + (p.topics?.length || 0), 0) || 0
    const doneCount = Object.keys(done).length
    const percent = totalTopics > 0 ? Math.round((doneCount / totalTopics) * 100) : 0

    const phaseProgress = useCallback((phaseId, topics) => {
        const total = topics?.length || 0
        const completed = topics?.filter(t => done[`${phaseId}_${t.id}`]).length || 0
        return {
            completed,
            total,
            percent: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
    }, [done])

    const reset = useCallback(() => {
        setDone({})
        persistProgress(topic, {})
    }, [topic])

    return { toggle, isTopicDone, doneCount, totalTopics, percent, phaseProgress, reset }
}