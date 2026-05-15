import { useState, useEffect } from 'react'

const MESSAGES = [
    { icon: '🔍', text: 'Analyzing your topic...' },
    { icon: '🧠', text: 'Structuring learning phases...' },
    { icon: '📚', text: 'Curating topics and resources...' },
    { icon: '💼', text: 'Building career paths...' },
    { icon: '✨', text: 'Almost ready...' },
]

export default function LoadingScreen({ topic }) {
    const [msgIndex, setMsgIndex] = useState(0)
    const [progress, setProgress] = useState(0)
    const [fade, setFade] = useState(true)

    useEffect(() => {
        // Progress bar — fills over ~12 seconds (typical DeepSeek response time)
        const progressInterval = setInterval(() => {
            setProgress(p => {
                // Slow down as it approaches 90% — never hits 100 until real data loads
                if (p >= 90) return p + 0.05
                if (p >= 70) return p + 0.15
                return p + 0.4
            })
        }, 60)

        // Cycle through messages
        const msgInterval = setInterval(() => {
            setFade(false)
            setTimeout(() => {
                setMsgIndex(i => (i + 1) % MESSAGES.length)
                setFade(true)
            }, 300)
        }, 2200)

        return () => {
            clearInterval(progressInterval)
            clearInterval(msgInterval)
        }
    }, [])

    const msg = MESSAGES[msgIndex]

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '24px', textAlign: 'center',
            position: 'relative', zIndex: 10,
        }}>

            {/* Animated ring */}
            <div style={{ position: 'relative', marginBottom: 40 }}>
                <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Background circle */}
                    <circle
                        cx="60" cy="60" r="52"
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="4"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="60" cy="60" r="52"
                        fill="none"
                        stroke="url(#grad)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 52}`}
                        strokeDashoffset={`${2 * Math.PI * 52 * (1 - Math.min(progress, 95) / 100)}`}
                        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                    />
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center icon */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 36,
                    transition: 'opacity 0.3s ease',
                    opacity: fade ? 1 : 0,
                }}>
                    {msg.icon}
                </div>
            </div>

            {/* Topic name */}
            <div style={{
                fontFamily: 'Space Grotesk', fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                letterSpacing: '-0.03em',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: 12,
            }}>
                {topic}
            </div>

            {/* Status message */}
            <div style={{
                fontFamily: 'DM Sans', fontSize: '1rem',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: 40, height: 28,
                transition: 'opacity 0.3s ease',
                opacity: fade ? 1 : 0,
            }}>
                {msg.text}
            </div>

            {/* Progress bar */}
            <div style={{
                width: '100%', maxWidth: 320, height: 4,
                borderRadius: 99, background: 'rgba(255,255,255,0.07)',
                overflow: 'hidden', marginBottom: 12,
            }}>
                <div style={{
                    height: '100%', borderRadius: 99,
                    width: `${Math.min(progress, 95)}%`,
                    background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                    boxShadow: '0 0 10px rgba(59,130,246,0.5)',
                    transition: 'width 0.3s ease',
                }} />
            </div>

            <div style={{
                fontFamily: 'Space Grotesk', fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.2)',
            }}>
                Generating your personalized roadmap...
            </div>
        </div>
    )
}