import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NeuralBg from '../components/NeuralBg.jsx'
import Footer from '../components/Footer.jsx'
import { getAllRoadmaps, deleteRoadmap, timeAgo, getStandaloneProgress } from '../utils/storage.js'

export default function Roadmaps() {
    const [roadmaps, setRoadmaps] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        setRoadmaps(getAllRoadmaps())
    }, [])

    function handleDelete(topic, e) {
        e.stopPropagation()
        if (!confirm(`Delete "${topic}" roadmap?`)) return
        deleteRoadmap(topic)
        setRoadmaps(getAllRoadmaps())
    }

    return (
        <div style={{ minHeight: '100vh', background: '#080810', position: 'relative' }}>
            <NeuralBg />

            {/* Orbs */}
            <div style={{ position: 'fixed', top: -200, left: -150, width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle,rgba(59,130,246,0.1),transparent 70%)' }} />

            {/* Navbar */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 40px',
                background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <button onClick={() => navigate('/')} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'none', border: 'none', cursor: 'pointer',
                }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: 9,
                        background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
                    }}>🧭</div>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.05rem', color: 'rgba(255,255,255,0.92)' }}>
                        Path <span style={{ color: '#60A5FA' }}>AI</span>
                    </span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <button onClick={() => navigate('/')} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: 'DM Sans', fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)',
                    }}>Home</button>
                    <button style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: 'DM Sans', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)',
                    }}>Roadmaps</button>
                </div>
            </nav>

            <div style={{ position: 'relative', zIndex: 10, paddingTop: 72, maxWidth: 900, margin: '0 auto', padding: '100px 24px 80px' }}>

                {/* Header */}
                <div className="fu" style={{ marginBottom: 40 }}>
                    <h1 style={{
                        fontFamily: 'Space Grotesk', fontWeight: 700,
                        fontSize: 'clamp(1.8rem,4vw,2.8rem)',
                        letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.95)', marginBottom: 10,
                    }}>
                        My <span style={{ background: 'linear-gradient(135deg,#60A5FA,#A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Roadmaps</span>
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
                        borderRadius: 24,
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
                        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                            No saved roadmaps yet
                        </div>
                        <p style={{ fontFamily: 'DM Sans', fontSize: '0.88rem', color: 'rgba(255,255,255,0.25)', marginBottom: 24 }}>
                            Generate a roadmap and it auto-saves here
                        </p>
                        <button className="btn-primary" onClick={() => navigate('/')}>
                            ✦ Generate Your First Roadmap
                        </button>
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
                        const doneCount = Object.keys(rm.progress || {}).length
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
                                onClick={() => navigate(`/result?topic=${encodeURIComponent(rm.topic)}`)}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = isComplete ? 'rgba(16,185,129,0.5)' : 'rgba(96,165,250,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = isComplete ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
                            >
                                {/* Delete button */}
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

                                {/* Topic */}
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ fontSize: 28, marginBottom: 10 }}>
                                        {isComplete ? '🎉' : '🗺️'}
                                    </div>
                                    <div style={{
                                        fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem',
                                        color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em', marginBottom: 4,
                                    }}>{rm.topic}</div>
                                    <div style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', color: 'rgba(255,255,255,0.28)' }}>
                                        {rm.data?.phases?.length} phases · {totalTopics} topics · {timeAgo(rm.savedAt)}
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div style={{ marginBottom: 8 }}>
                                    <div style={{
                                        height: 4, borderRadius: 99,
                                        background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            height: '100%', borderRadius: 99,
                                            width: `${percent}%`,
                                            background: isComplete
                                                ? 'linear-gradient(90deg,#10B981,#34D399)'
                                                : 'linear-gradient(90deg,#3B82F6,#8B5CF6)',
                                            transition: 'width 0.4s ease',
                                        }} />
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                }}>
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