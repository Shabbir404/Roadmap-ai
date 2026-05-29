import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import CareerRoadmapContent from '../components/CareerRoadmapContent.jsx'
import { getRoadmap } from '../utils/storage.js'

export default function CareerRoadmap() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const topic = params.get('topic') || ''
    const careerTitle = params.get('career') || ''
    const fromTemplate = params.get('source') === 'template'

    const [career, setCareer] = useState(null)
    const [resolving, setResolving] = useState(true)

    useEffect(() => {
        if (!topic || !careerTitle) {
            navigate('/', { replace: true })
            return
        }

        let cancelled = false

        async function init() {
            setResolving(true)
            const roadmap = await getRoadmap(topic)
            const found = roadmap?.data?.careers?.find(
                c => c.title.toLowerCase() === careerTitle.toLowerCase()
            )
            if (cancelled) return
            if (!found) {
                navigate(`/result?topic=${encodeURIComponent(topic)}${fromTemplate ? '&source=template' : ''}`, { replace: true })
                return
            }
            setCareer(found)
            setResolving(false)
        }

        init()
        return () => { cancelled = true }
    }, [topic, careerTitle, fromTemplate, navigate])

    function backToRoadmap() {
        const q = new URLSearchParams({ topic })
        if (fromTemplate) q.set('source', 'template')
        navigate(`/result?${q.toString()}`)
    }

    if (resolving || !career) {
        return (
            <div className="career-page-shell">
                <div className="career-page-panel">
                    <div style={{ padding: '48px 28px' }}>
                        {[1, 2].map(i => (
                            <div key={i} className="skeleton" style={{ height: 48, borderRadius: 12, marginBottom: 12 }} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="career-page-shell">
            <div className="career-page-panel">
                <CareerRoadmapContent
                    career={career}
                    topic={topic}
                    onClose={backToRoadmap}
                    fromTemplate={fromTemplate}
                />
            </div>
        </div>
    )
}
