import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import CareerRoadmapContent from '../components/CareerRoadmapContent.jsx'
import { getRoadmap, getAllRoadmaps } from '../utils/storage.js'

function roadmapData(row) {
    if (!row) return null
    return row.data || row
}

async function resolveCareer(topic, careerTitle, stateCareer) {
    if (stateCareer?.title && stateCareer.title.toLowerCase() === careerTitle.toLowerCase()) {
        return { career: stateCareer, topic }
    }

    let resolvedTopic = topic
    const row = await getRoadmap(topic)
    let data = roadmapData(row)

    if (!data?.careers?.length) {
        const all = await getAllRoadmaps()
        const match = all.find(r => r.topic?.toLowerCase() === topic.toLowerCase())
        if (match) {
            resolvedTopic = match.topic
            data = roadmapData(match)
        }
    } else if (row?.topic) {
        resolvedTopic = row.topic
    }

    const career = data?.careers?.find(
        c => c.title.toLowerCase() === careerTitle.toLowerCase()
    )
    return career ? { career, topic: resolvedTopic } : null
}

export default function CareerRoadmap() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()
    const topic = params.get('topic') || ''
    const careerTitle = params.get('career') || ''
    const fromTemplate = params.get('source') === 'template'
    const stateCareer = location.state?.career

    const [career, setCareer] = useState(null)
    const [resolvedTopic, setResolvedTopic] = useState(topic)
    const [resolving, setResolving] = useState(true)

    useEffect(() => {
        if (!topic || !careerTitle) {
            navigate('/', { replace: true })
            return
        }

        let cancelled = false
        async function init() {
            setResolving(true)
            const result = await resolveCareer(topic, careerTitle, stateCareer)
            if (cancelled) return
            if (!result) {
                navigate(`/result?topic=${encodeURIComponent(topic)}${fromTemplate ? '&source=template' : ''}`, { replace: true })
                return
            }
            setCareer(result.career)
            setResolvedTopic(result.topic)
            setResolving(false)
        }
        init()
        return () => { cancelled = true }
    }, [topic, careerTitle, fromTemplate, navigate, stateCareer])

    function backToRoadmap() {
        const q = new URLSearchParams({ topic: resolvedTopic || topic })
        if (fromTemplate) q.set('source', 'template')
        navigate(`/result?${q.toString()}`)
    }

    return (
        <div className="career-standalone">
            {resolving || !career ? (
                <div style={{ padding: '24px 28px 48px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ marginBottom: 12 }}>
                            <div className="skeleton" style={{ height: 64, borderRadius: 16 }} />
                        </div>
                    ))}
                </div>
            ) : (
                <CareerRoadmapContent
                    career={career}
                    topic={resolvedTopic}
                    onClose={backToRoadmap}
                    fromTemplate={fromTemplate}
                />
            )}
        </div>
    )
}
