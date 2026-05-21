import { useState, useEffect, useCallback } from 'react'
import { getProgress, saveProgress } from '../utils/storage.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function useProgress(topic, phases) {
    const [done, setDone] = useState({})
    const [loaded, setLoaded] = useState(false)
    const { user } = useAuth()

    // Load progress when topic or user changes
    useEffect(() => {
        if (!topic) return
        setLoaded(false)
        getProgress(topic).then(saved => {
            setDone(saved || {})
            setLoaded(true)
        })
    }, [topic, user])

    const toggle = useCallback((phaseId, topicId) => {
        if (!loaded) return
        setDone(prev => {
            const key = `${phaseId}_${topicId}`
            const next = { ...prev }
            if (next[key]) delete next[key]
            else next[key] = true
            // Save async — don't block UI
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
    const doneCount = Object.keys(done).length
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
        saveProgress(topic, {})
    }, [topic])

    return { toggle, isTopicDone, doneCount, totalTopics, percent, phaseProgress, reset, loaded }
}