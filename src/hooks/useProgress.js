import { useState, useEffect, useCallback, useMemo } from 'react'
import { getProgress, saveProgress } from '../utils/storage.js'
import { useAuth } from '../contexts/AuthContext.jsx'

function countCompleted(done, phases) {
    if (!phases?.length) return 0
    return phases.reduce((sum, phase) => {
        const topics = phase.topics || []
        const completed = topics.filter(t => done[`${phase.id}_${t.id}`]).length
        return sum + completed
    }, 0)
}

export function useProgress(topic, phases) {
    const [done, setDone] = useState({})
    const [loaded, setLoaded] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        if (!topic) return
        let cancelled = false
        setLoaded(false)

        getProgress(topic).then(saved => {
            if (!cancelled) {
                setDone(saved || {})
                setLoaded(true)
            }
        })

        return () => { cancelled = true }
    }, [topic, user?.id])

    const toggle = useCallback((phaseId, topicId) => {
        if (!loaded) return
        setDone(prev => {
            const key = `${phaseId}_${topicId}`
            const next = { ...prev }
            if (next[key]) delete next[key]
            else next[key] = true
            saveProgress(topic, next).catch(err =>
                console.error('Progress save error:', err)
            )
            return next
        })
    }, [topic, loaded])

    const isTopicDone = useCallback((phaseId, topicId) => {
        return !!done[`${phaseId}_${topicId}`]
    }, [done])

    const totalTopics = phases?.reduce((sum, p) => sum + (p.topics?.length || 0), 0) || 0
    const doneCount = useMemo(() => countCompleted(done, phases), [done, phases])
    const percent = totalTopics > 0 ? Math.round((doneCount / totalTopics) * 100) : 0

    const phaseProgress = useCallback((phaseId, topics) => {
        const total = topics?.length || 0
        const completed = topics?.filter(t => done[`${phaseId}_${t.id}`]).length || 0
        return {
            completed, total,
            percent: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
    }, [done])

    const reset = useCallback(() => {
        setDone({})
        saveProgress(topic, {}).catch(err => console.error('Progress reset error:', err))
    }, [topic])

    return { toggle, isTopicDone, doneCount, totalTopics, percent, phaseProgress, reset, loaded }
}
