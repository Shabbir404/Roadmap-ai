import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import NeuralBg from '../components/NeuralBg.jsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { TEMPLATES, templateToRoadmapData } from '../data/templates.js'
import { saveRoadmapLocal, hasLocalRoadmap } from '../utils/storage.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { buildTitle } from '../utils/seo.js'

const ALL_TAGS = ['All', 'Beginner Friendly', 'Programming', 'Web Dev', 'AI', 'Data Science', 'Design', 'Security', 'Mobile', 'Advanced']

export default function Templates() {
    const navigate = useNavigate()

    usePageMeta({
        title: buildTitle('Free Learning Templates'),
        description: 'Pre-built roadmaps for Python, React, Machine Learning, UI/UX, cybersecurity, and more. Unlimited, free, and no login required.',
        path: '/templates',
    })

    const [activeTag, setActiveTag] = useState('All')
    const [savedTopics, setSavedTopics] = useState(() => new Set())

    useEffect(() => {
        const topics = new Set(
            TEMPLATES.filter(t => hasLocalRoadmap(t.topic)).map(t => t.topic)
        )
        setSavedTopics(topics)
    }, [])

    const filtered = activeTag === 'All'
        ? TEMPLATES
        : TEMPLATES.filter(t => t.tags.includes(activeTag))

    function useTemplate(template) {
        saveRoadmapLocal(template.topic, templateToRoadmapData(template))
        setSavedTopics(prev => new Set([...prev, template.topic]))
        navigate(`/result?topic=${encodeURIComponent(template.topic)}&source=template`)
    }

    return (
        <div className="page-shell">
            <NeuralBg />
            <div className="page-orb page-orb--blue" />

            <Navbar rightContent={<span className="nav-credit-badge">⚡ Templates</span>} />

            <main className="page-main page-main--wide">

                {/* Header */}
                <div className="fu" style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '5px 16px', borderRadius: 99, marginBottom: 16,
                        background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)',
                    }}>
                        <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', color: '#A78BFA', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Industry Needs...
                        </span>
                    </div>
                    <h1 style={{
                        fontFamily: 'Space Grotesk', fontWeight: 700,
                        fontSize: 'clamp(1.8rem,4vw,2.8rem)',
                        letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.95)', marginBottom: 12,
                    }}>
                        Start Learning<span style={{
                            background: 'linear-gradient(135deg,#60A5FA,#A78BFA)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}> Demandable Skills</span>
                    </h1>
                    <p style={{
                        fontFamily: 'DM Sans', fontSize: '0.95rem',
                        color: 'rgba(255,255,255,0.35)', maxWidth: 480, margin: '0 auto',
                    }}>
                        Pre-built roadmaps — unlimited, free, no login. Never counts toward your AI quota.
                    </p>
                </div>

                {/* Tag filters */}
                <div className="fu1" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36, justifyContent: 'center' }}>
                    {ALL_TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            style={{
                                padding: '6px 16px', borderRadius: 99, cursor: 'pointer',
                                fontFamily: 'Space Grotesk', fontSize: '0.8rem', fontWeight: 500,
                                background: activeTag === tag ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${activeTag === tag ? 'rgba(96,165,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                color: activeTag === tag ? '#60A5FA' : 'rgba(255,255,255,0.35)',
                                transition: 'all 0.2s',
                            }}
                        >{tag}</button>
                    ))}
                </div>

                {/* Template grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 18,
                }}>
                    {filtered.map((template, i) => {
                        const alreadySaved = savedTopics.has(template.topic)
                        return (
                            <div
                                key={template.id}
                                className="fu"
                                style={{
                                    animationDelay: `${i * 0.06}s`,
                                    padding: '24px', borderRadius: 20,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${alreadySaved ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
                                    transition: 'all 0.3s ease', cursor: 'pointer',
                                    position: 'relative', overflow: 'hidden',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = `${template.color}50`
                                    e.currentTarget.style.transform = 'translateY(-4px)'
                                    e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.3)`
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = alreadySaved ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                                onClick={() => useTemplate(template)}
                            >
                                {/* Already saved badge */}
                                {alreadySaved && (
                                    <div style={{
                                        position: 'absolute', top: 16, right: 16,
                                        padding: '3px 10px', borderRadius: 99,
                                        background: 'rgba(16,185,129,0.12)',
                                        border: '1px solid rgba(16,185,129,0.3)',
                                        fontFamily: 'Space Grotesk', fontSize: '0.68rem',
                                        fontWeight: 600, color: '#10B981',
                                    }}>✓ Saved</div>
                                )}

                                {/* Emoji */}
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14, marginBottom: 16,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 26, background: `${template.color}18`,
                                    border: `1px solid ${template.color}30`,
                                }}>{template.emoji}</div>

                                {/* Title */}
                                <div style={{
                                    fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.05rem',
                                    color: 'rgba(255,255,255,0.92)', marginBottom: 8, letterSpacing: '-0.02em',
                                }}>{template.topic}</div>

                                {/* Description */}
                                <div style={{
                                    fontFamily: 'DM Sans', fontSize: '0.82rem',
                                    color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, marginBottom: 18,
                                }}>{template.description}</div>

                                {/* Meta */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 99, fontSize: '0.72rem',
                                        background: `${template.color}14`, border: `1px solid ${template.color}30`,
                                        color: template.color, fontFamily: 'Space Grotesk', fontWeight: 500,
                                    }}>{template.phases.length} Phases</span>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 99, fontSize: '0.72rem',
                                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                        color: 'rgba(255,255,255,0.35)', fontFamily: 'Space Grotesk',
                                    }}>~{template.weeks} weeks</span>
                                </div>

                                {/* Tags */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                                    {template.tags.map(tag => (
                                        <span key={tag} style={{
                                            padding: '2px 8px', borderRadius: 99, fontSize: '0.68rem',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.07)',
                                            color: 'rgba(255,255,255,0.28)', fontFamily: 'DM Sans',
                                        }}>{tag}</span>
                                    ))}
                                </div>

                                {/* CTA */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: 8, padding: '10px', borderRadius: 12,
                                    background: `${template.color}12`,
                                    border: `1px solid ${template.color}25`,
                                    fontFamily: 'Space Grotesk', fontSize: '0.82rem',
                                    fontWeight: 600, color: template.color,
                                }}>
                                    {alreadySaved ? '→ Continue Learning' : '✦ Learn this'}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>
            <Footer />
        </div>
    )
}