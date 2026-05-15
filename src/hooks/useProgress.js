import { useState, useEffect, useCallback } from 'react'
import { getProgress, saveProgress } from '../utils/storage.js'

export function useProgress(topic, phases) {
    const [done, setDone] = useState({})

    useEffect(() => {
        if (!topic) return
        setDone(getProgress(topic))
    }, [topic])

    useEffect(() => {
        if (!topic) return
        saveProgress(topic, done)
    }, [done, topic])

    const toggle = useCallback((phaseId, topicId) => {
        setDone(prev => {
            const key = `${phaseId}_${topicId}`
            const next = { ...prev }
            if (next[key]) delete next[key]
            else next[key] = true
            return next
        })
    }, [])

    const isTopicDone = useCallback((phaseId, topicId) => {
        return !!done[`${phaseId}_${topicId}`]
    }, [done])

    const totalTopics = phases?.reduce((sum, p) => sum + (p.topics?.length || 0), 0) || 0
    const doneCount = Object.keys(done).length
    const percent = totalTopics > 0 ? Math.round((doneCount / totalTopics) * 100) : 0

    const phaseProgress = (phaseId, topics) => {
        const total = topics?.length || 0
        const completed = topics?.filter(t => done[`${phaseId}_${t.id}`]).length || 0
        return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 }
    }

    const reset = () => {
        setDone({})
        saveProgress(topic, {})
    }

    return { toggle, isTopicDone, doneCount, totalTopics, percent, phaseProgress, reset }
}