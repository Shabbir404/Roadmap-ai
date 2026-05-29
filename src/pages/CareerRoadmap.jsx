import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import NeuralBg from '../components/NeuralBg.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import AuthModal from '../components/AuthModal.jsx'
import CareerPhaseList from '../components/CareerPhaseList.jsx'
import { useProgress } from '../hooks/useProgress.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { generateCareerRoadmap } from '../utils/ai.js'
import { getRoadmap, getCareerRoadmap, saveCareerRoadmap, isAiCareerCache } from '../utils/storage.js'
import { canGenerateCareer, incrementCareer } from '../utils/generationLimits.js'

export default function CareerRoadmap() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const topic = params.get('topic') || ''
    const careerTitle = params.get('career') || ''
    const fromTemplate = params.get('source') === 'template'

    const [career, setCareer] = useState(null)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)
    const [needsSignIn, setNeedsSignIn] = useState(false)
    const [showAuth, setShowAuth] = useState(false)
    const { user } = useAuth()

    const progressKey = career ? `${topic}__${career.title}` : ''
    const { toggle, isTopicDone, doneCount, totalTopics, percent, phaseProgress, reset } = useProgress(progressKey, data?.phases)

    useEffect(() => {
        if (!topic || !careerTitle) {
            navigate('/', { replace: true })
            return
        }

        let cancelled = false

        async function init() {
            const roadmap = await getRoadmap(topic)
            const found = roadmap?.data?.careers?.find(
                c => c.title.toLowerCase() === careerTitle.toLowerCase()
            )
            if (!found) {
                navigate(`/result?topic=${encodeURIComponent(topic)}${fromTemplate ? '&source=template' : ''}`, { replace: true })
                return
            }
            if (!cancelled) setCareer(found)
        }

        init()
        return () => { cancelled = true }
    }, [topic, careerTitle, fromTemplate, navigate])

    useEffect(() => {
        if (!career) return
        let cancelled = false

        async function load() {
            setLoading(true)
            setLoadError(null)
            setNeedsSignIn(false)
            try {
                const cached = await getCareerRoadmap(topic, career.title)
                if (cancelled) return

                if (isAiCareerCache(cached)) {
                    setData(cached.data)
                    return
                }

                if (!canGenerateCareer(user)) {
                    setNeedsSignIn(true)
                    return
                }

                const d = await generateCareerRoadmap(topic, career.title)
                if (cancelled) return
                setData(d)
                incrementCareer(user)
                try {
                    await saveCareerRoadmap(topic, career.title, d)
                } catch (saveErr) {
                    if (!saveErr.localSaved) throw saveErr
                }
            } catch (e) {
                if (!cancelled) setLoadError(e?.message || 'Failed to generate career roadmap')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => { cancelled = true }
    }, [career, topic, user, fromTemplate])

    function backToRoadmap() {
        const q = new URLSearchParams({ topic })
        if (fromTemplate) q.set('source', 'template')
        navigate(`/result?${q.toString()}`)
    }

    const progressPill = !loading && totalTopics > 0 && (
        <div className="nav-progress-pill">
            <div className="nav-progress-bar"><div style={{ width: `${percent}%` }} /></div>
            <span>{percent === 100 ? 'Done' : `${percent}%`}</span>
        </div>
    )

    return (
        <div className="page-shell">
            <NeuralBg />
            <div className="page-orb page-orb--blue" />
            <div className="page-orb page-orb--purple" />

            <Navbar rightContent={progressPill} />

            <main className="page-main career-page">
                {loading ? (
                    <LoadingScreen topic={`${career?.title || careerTitle} career`} />
                ) : needsSignIn ? (
                    <div className="career-page-state">
                        <span className="career-page-state-icon">🔐</span>
                        <h1>Sign in for more career paths</h1>
                        <p>You used your free career roadmap. Sign in to unlock unlimited career paths.</p>
                        <button type="button" className="btn-primary" onClick={() => setShowAuth(true)}>Sign in with Google</button>
                        <button type="button" className="nav-btn-ghost" onClick={backToRoadmap}>← Back to roadmap</button>
                    </div>
                ) : loadError ? (
                    <div className="career-page-state">
                        <span className="career-page-state-icon">⚠️</span>
                        <h1>Couldn&apos;t load career roadmap</h1>
                        <p>{loadError}</p>
                        <button type="button" className="btn-primary" onClick={() => window.location.reload()}>Try again</button>
                        <button type="button" className="nav-btn-ghost" onClick={backToRoadmap}>← Back to roadmap</button>
                    </div>
                ) : data && career ? (
                    <div className="career-page-content">
                        <button type="button" className="career-back-link" onClick={backToRoadmap}>
                            ← Back to {topic}
                        </button>

                        <header className="career-page-header">
                            <div className="career-page-hero-icon" style={{
                                background: `${career.color}18`,
                                borderColor: `${career.color}40`,
                            }}>
                                {career.emoji}
                            </div>
                            <div>
                                <p className="career-page-eyebrow">Career path · {topic}</p>
                                <h1 className="career-page-title">{career.title}</h1>
                                <p className="career-page-sub">{data.title || `${career.title} roadmap`}</p>
                            </div>
                        </header>

                        <div className="career-intro-card" style={{
                            borderColor: `${career.color}30`,
                            background: `${career.color}0A`,
                        }}>
                            <p>{data.intro}</p>
                        </div>

                        {totalTopics > 0 && (
                            <div className={`career-progress-card ${percent === 100 ? 'career-progress-card--done' : ''}`}>
                                <div className="career-progress-top">
                                    <span>{percent === 100 ? '🎉 Career path complete' : 'Your progress'}</span>
                                    <span className="career-progress-pct">{percent}%</span>
                                </div>
                                <div className="career-progress-track">
                                    <div className="career-progress-fill" style={{ width: `${percent}%` }} />
                                </div>
                                <div className="career-progress-meta">
                                    <span>{doneCount}/{totalTopics} topics</span>
                                    {doneCount > 0 && (
                                        <button type="button" className="career-reset-btn" onClick={reset}>Reset</button>
                                    )}
                                </div>
                            </div>
                        )}

                        <CareerPhaseList
                            phases={data.phases}
                            topic={topic}
                            isTopicDone={isTopicDone}
                            onToggle={toggle}
                            phaseProgress={phaseProgress}
                        />

                        <Footer />
                    </div>
                ) : null}
            </main>

            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </div>
    )
}
