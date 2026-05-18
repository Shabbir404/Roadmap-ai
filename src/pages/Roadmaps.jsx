import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import NeuralBg from '../components/NeuralBg.jsx'
import Footer from '../components/Footer.jsx'
import { getAllRoadmaps, deleteRoadmap, timeAgo, getStandaloneProgress } from '../utils/storage.js'
import Navbar from '../components/Navbar.jsx'

export default function Roadmaps() {
    const [roadmaps, setRoadmaps] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        getAllRoadmaps().then(data => setRoadmaps(data || []))
    }, [])

    const stats = useMemo(() => {
        const totalRoadmaps = roadmaps.length
        const totalTopics = roadmaps.reduce((sum, rm) =>
            sum + (rm.data?.phases?.reduce((s, p) => s + (p.topics?.length || 0), 0) || 0), 0)
        const completedTopics = roadmaps.reduce((sum, rm) => {
            const progress = getStandaloneProgress(rm.topic)
            return sum + Object.keys(progress).length
        }, 0)
        const bestRoadmap = roadmaps.reduce((best, rm) => {
            const total = rm.data?.phases?.reduce((s, p) => s + (p.topics?.length || 0), 0) || 0
            const done = Object.keys(getStandaloneProgress(rm.topic)).length
            const pct = total > 0 ? Math.round((done / total) * 100) : 0
            return pct > (best.pct || 0) ? { topic: rm.topic, pct } : best
        }, {})
        const completedRoadmaps = roadmaps.filter(rm => {
            const total = rm.data?.phases?.reduce((s, p) => s + (p.topics?.length || 0), 0) || 0
            const done = Object.keys(getStandaloneProgress(rm.topic)).length
            return total > 0 && done === total
        }).length
        return { totalRoadmaps, totalTopics, completedTopics, bestRoadmap, completedRoadmaps }
    }, [roadmaps])

    async function handleDelete(topic, e) {
        e.stopPropagation()
        if (!window.confirm(`Delete "${topic}" roadmap?`)) return
        await deleteRoadmap(topic)
        const updated = await getAllRoadmaps()
        setRoadmaps(updated || [])
    }

    return (
        <div style={{ minHeight: '100vh', background: '#080810', position: 'relative' }}>
            <NeuralBg />
            <div style={{ position: 'fixed', top: -200, left: -150, width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle,rgba(59,130,246,0.1),transparent 70%)' }} />

            {/* Navbar */}
            <Navbar rightContent={
                // pass page-specific content like progress pill here
                // if nothing needed just pass null
                null
            } />

            <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto', padding: '100px 24px 80px' }}>

                {/* Header */}
                <div className="fu" style={{ marginBottom: 40 }}>
                    <h1 style={{
                        fontFamily: 'Space Grotesk', fontWeight: 700,
                        fontSize: 'clamp(1.8rem,4vw,2.8rem)',
                        letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.95)', marginBottom: 10,
                    }}>
                        My <span style={{
                            background: 'linear-gradient(135deg,#60A5FA,#A78BFA)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>Roadmaps</span>
                    </h1>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '0.95rem', color: 'rgba(255,255,255,0.35)' }}>
                        {roadmaps.length} saved roadmap{roadmaps.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Empty state */}
                {roadmaps.length === 0 && (
                    <div className="fu1" style={{
                        textAlign: 'center', padding: '80px 40px',
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 24, marginBottom: 32,
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
                        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                            No saved roadmaps yet
                        </div>
                        <p style={{ fontFamily: 'DM Sans', fontSize: '0.88rem', color: 'rgba(255,255,255,0.25)', marginBottom: 24 }}>
                            Generate a roadmap and it auto-saves here
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn-primary" onClick={() => navigate('/')}>
                                ✦ Generate Your First Roadmap
                            </button>
                            <button
                                onClick={() => navigate('/templates')}
                                style={{
                                    padding: '10px 22px', borderRadius: 12, cursor: 'pointer',
                                    background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)',
                                    fontFamily: 'Space Grotesk', fontSize: '0.9rem', fontWeight: 600, color: '#A78BFA',
                                }}
                            >Browse Templates →</button>
                        </div>
                    </div>
                )}

                {/* Stats */}
                {roadmaps.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: 12, marginBottom: 40,
                    }}>
                        {[
                            { icon: '🗺️', value: stats.totalRoadmaps, label: 'Roadmaps Saved', color: '#3B82F6' },
                            { icon: '✅', value: stats.completedTopics, label: 'Topics Completed', color: '#10B981' },
                            { icon: '🎯', value: `${stats.totalTopics > 0 ? Math.round((stats.completedTopics / stats.totalTopics) * 100) : 0}%`, label: 'Overall Progress', color: '#8B5CF6' },
                            { icon: '🏆', value: stats.completedRoadmaps, label: 'Completed', color: '#F59E0B' },
                            {
                                icon: '🔥',
                                value: stats.bestRoadmap?.topic ? `${stats.bestRoadmap.pct}%` : '—',
                                label: stats.bestRoadmap?.topic ? `Best: ${stats.bestRoadmap.topic}` : 'No progress yet',
                                color: '#EC4899',
                            },
                        ].map((s, i) => (
                            <div key={s.label} className="fu" style={{
                                animationDelay: `${i * 0.05}s`,
                                padding: '20px', borderRadius: 16,
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.07)',
                            }}>
                                <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
                                <div style={{
                                    fontFamily: 'Space Grotesk', fontWeight: 700,
                                    fontSize: '1.6rem', letterSpacing: '-0.03em',
                                    background: `linear-gradient(135deg, ${s.color}, ${s.color}99)`,
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text', marginBottom: 4,
                                }}>{s.value}</div>
                                <div style={{
                                    fontFamily: 'DM Sans', fontSize: '0.78rem',
                                    color: 'rgba(255,255,255,0.3)', lineHeight: 1.4,
                                }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 16,
                }}>
                    {roadmaps.map((rm, i) => {
                        const totalTopics = rm.data?.phases?.reduce((s, p) => s + (p.topics?.length || 0), 0) || 0
                        const progress = getStandaloneProgress(rm.topic)
                        const doneCount = Object.keys(progress).length
                        const percent = totalTopics > 0 ? Math.round((doneCount / totalTopics) * 100) : 0
                        const isComplete = percent === 100 && totalTopics > 0

                        return (
                            <div
                                key={rm.topic}
                                className="fu"
                                style={{
                                    animationDelay: `${i * 0.06}s`,
                                    padding: '24px', borderRadius: 20, cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${isComplete ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                                    transition: 'all 0.3s ease', position: 'relative',
                                }}
                                onClick={() => navigate(
                                    `/result?topic=${encodeURIComponent(rm.topic)}${rm.source === 'template' ? '&source=template' : ''}`
                                )}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = isComplete ? 'rgba(16,185,129,0.5)' : 'rgba(96,165,250,0.3)'
                                    e.currentTarget.style.transform = 'translateY(-3px)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = isComplete ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                }}
                            >
                                <button
                                    onClick={e => handleDelete(rm.topic, e)}
                                    style={{
                                        position: 'absolute', top: 16, right: 16,
                                        width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer',
                                        background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.25)',
                                        fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#EF4444' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)' }}
                                >✕</button>

                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontSize: 28, marginBottom: 10 }}>{isComplete ? '🎉' : '🗺️'}</div>
                                    <div style={{
                                        fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem',
                                        color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em', marginBottom: 4,
                                    }}>{rm.topic}</div>
                                    <div style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', color: 'rgba(255,255,255,0.28)' }}>
                                        {rm.data?.phases?.length} phases · {totalTopics} topics · {timeAgo(rm.created_at || rm.savedAt)}
                                    </div>
                                </div>

                                <div style={{ marginBottom: 8 }}>
                                    <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', borderRadius: 99, width: `${percent}%`,
                                            background: isComplete ? 'linear-gradient(90deg,#10B981,#34D399)' : 'linear-gradient(90deg,#3B82F6,#8B5CF6)',
                                            transition: 'width 0.4s ease',
                                        }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)' }}>
                                        {doneCount}/{totalTopics} completed
                                    </span>
                                    <span style={{
                                        fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.85rem',
                                        color: isComplete ? '#10B981' : '#60A5FA',
                                    }}>{percent}%</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Footer />
        </div>
    )
}