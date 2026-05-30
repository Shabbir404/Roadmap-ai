import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import NeuralBg from '../components/NeuralBg.jsx'
import CareerRoadmapContent from '../components/CareerRoadmapContent.jsx'
import { getRoadmap, getAllRoadmaps } from '../utils/storage.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { buildTitle, truncateDescription } from '../utils/seo.js'

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

    const displayTopic = resolvedTopic || topic
    usePageMeta({
        title: careerTitle && displayTopic
            ? buildTitle(`${careerTitle} Career Roadmap`)
            : buildTitle('Career Roadmap'),
        description: truncateDescription(
            career?.description ||
            (careerTitle && displayTopic
                ? `Step-by-step career roadmap to become a ${careerTitle} using ${displayTopic}. Free phases, topics, and progress tracking.`
                : undefined)
        ),
        path: careerTitle && displayTopic
            ? `/career?topic=${encodeURIComponent(displayTopic)}&career=${encodeURIComponent(careerTitle)}${fromTemplate ? '&source=template' : ''}`
            : '/career',
    })

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

    const navRight = (
        <button type="button" className="nav-btn-ghost" onClick={backToRoadmap}>
            ← Back to roadmap
        </button>
    )

    return (
        <div className="page-shell">
            <NeuralBg />
            <div className="page-orb page-orb--blue" />
            <div className="page-orb page-orb--purple" />

            <Navbar rightContent={navRight} />

            <main className="page-main">
                <button type="button" className="career-back-link" onClick={backToRoadmap}>
                    ← Back to {resolvedTopic || topic} roadmap
                </button>

                {resolving || !career ? (
                    <div>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton" style={{ height: 64, borderRadius: 16, marginBottom: 12 }} />
                        ))}
                    </div>
                ) : (
                    <CareerRoadmapContent
                        career={career}
                        topic={resolvedTopic}
                        fromTemplate={fromTemplate}
                    />
                )}

                <Footer />
            </main>
        </div>
    )
}
