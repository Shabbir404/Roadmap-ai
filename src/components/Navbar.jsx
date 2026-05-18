import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthModal from './AuthModal.jsx'

export default function Navbar({ rightContent }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, signOut } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const [showAuth, setShowAuth] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close menu on route change
    useEffect(() => { setMenuOpen(false) }, [location])

    const links = [
        { label: 'Home', path: '/' },
        { label: 'Roadmaps', path: '/roadmaps' },
        { label: 'Templates', path: '/templates' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <>
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                background: scrolled ? 'rgba(8,8,16,0.95)' : 'rgba(8,8,16,0.85)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                transition: 'background 0.3s ease',
            }}>
                <div style={{
                    maxWidth: 1100, margin: '0 auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 24px',
                }}>

                    {/* Logo */}
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
                        }}
                    >
                        <div style={{
                            width: 34, height: 34, borderRadius: 9,
                            background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
                        }}>🧭</div>
                        <span style={{
                            fontFamily: 'Space Grotesk', fontWeight: 700,
                            fontSize: '1.05rem', color: 'rgba(255,255,255,0.92)',
                        }}>
                            Path <span style={{ color: '#60A5FA' }}>AI</span>
                        </span>
                    </button>

                    {/* Desktop nav links */}
                    <div className="desktop-nav" style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                        {links.map(link => (
                            <button
                                key={link.label}
                                onClick={() => navigate(link.path)}
                                style={{
                                    background: isActive(link.path) ? 'rgba(255,255,255,0.06)' : 'none',
                                    border: 'none', cursor: 'pointer',
                                    fontFamily: 'DM Sans', fontSize: '0.9rem',
                                    color: isActive(link.path) ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.4)',
                                    padding: '6px 14px', borderRadius: 8, transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = isActive(link.path) ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.4)'
                                    e.currentTarget.style.background = isActive(link.path) ? 'rgba(255,255,255,0.06)' : 'none'
                                }}
                            >{link.label}</button>
                        ))}
                    </div>

                    {/* Right side */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

                        {/* Extra content passed from page (progress pill etc) */}
                        <div className="desktop-nav">
                            {rightContent}
                        </div>

                        {/* Auth — desktop */}
                        <div className="desktop-nav">
                            {user ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '6px 12px', borderRadius: 99,
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                    }}>
                                        <div style={{
                                            width: 22, height: 22, borderRadius: 99,
                                            background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 10, color: 'white', fontWeight: 700, fontFamily: 'Space Grotesk',
                                        }}>
                                            {user.email?.[0].toUpperCase()}
                                        </div>
                                        <span style={{
                                            fontFamily: 'DM Sans', fontSize: '0.8rem',
                                            color: 'rgba(255,255,255,0.45)',
                                            maxWidth: 130, overflow: 'hidden',
                                            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>
                                            {user.email}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => { if (window.confirm('Sign out?')) signOut() }}
                                        style={{
                                            padding: '6px 12px', borderRadius: 99, cursor: 'pointer',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            fontFamily: 'DM Sans', fontSize: '0.8rem',
                                            color: 'rgba(255,255,255,0.35)',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                                    >Sign out</button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAuth(true)}
                                    className="btn-primary"
                                    style={{ padding: '8px 18px' }}
                                >Sign in</button>
                            )}
                        </div>

                        {/* Hamburger — mobile only */}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMenuOpen(o => !o)}
                            style={{
                                display: 'none',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 10, padding: '8px 10px',
                                cursor: 'pointer', flexDirection: 'column',
                                gap: 5, alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <div style={{
                                width: 20, height: 2, borderRadius: 99,
                                background: 'rgba(255,255,255,0.7)',
                                transition: 'all 0.3s ease',
                                transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                            }} />
                            <div style={{
                                width: 20, height: 2, borderRadius: 99,
                                background: 'rgba(255,255,255,0.7)',
                                transition: 'all 0.3s ease',
                                opacity: menuOpen ? 0 : 1,
                            }} />
                            <div style={{
                                width: 20, height: 2, borderRadius: 99,
                                background: 'rgba(255,255,255,0.7)',
                                transition: 'all 0.3s ease',
                                transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                            }} />
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown menu */}
                <div style={{
                    overflow: 'hidden',
                    maxHeight: menuOpen ? '400px' : '0',
                    transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
                    borderTop: menuOpen ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                    <div style={{ padding: '12px 24px 20px' }}>
                        {/* Nav links */}
                        {links.map(link => (
                            <button
                                key={link.label}
                                onClick={() => navigate(link.path)}
                                style={{
                                    display: 'block', width: '100%', textAlign: 'left',
                                    padding: '12px 16px', borderRadius: 12, marginBottom: 4,
                                    background: isActive(link.path) ? 'rgba(96,165,250,0.08)' : 'none',
                                    border: 'none', cursor: 'pointer',
                                    fontFamily: 'DM Sans', fontSize: '0.95rem',
                                    color: isActive(link.path) ? '#60A5FA' : 'rgba(255,255,255,0.6)',
                                    transition: 'all 0.2s',
                                }}
                            >{link.label}</button>
                        ))}

                        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />

                        {/* Auth — mobile */}
                        {user ? (
                            <div>
                                <div style={{
                                    padding: '10px 16px', borderRadius: 12, marginBottom: 8,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                }}>
                                    <div style={{
                                        fontFamily: 'DM Sans', fontSize: '0.82rem',
                                        color: 'rgba(255,255,255,0.4)',
                                    }}>Signed in as</div>
                                    <div style={{
                                        fontFamily: 'Space Grotesk', fontWeight: 600,
                                        fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    }}>{user.email}</div>
                                </div>
                                <button
                                    onClick={() => { if (window.confirm('Sign out?')) signOut() }}
                                    style={{
                                        width: '100%', padding: '11px 16px', borderRadius: 12,
                                        background: 'rgba(239,68,68,0.08)',
                                        border: '1px solid rgba(239,68,68,0.2)',
                                        fontFamily: 'DM Sans', fontSize: '0.9rem',
                                        color: '#F87171', cursor: 'pointer', textAlign: 'left',
                                    }}
                                >Sign out</button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setShowAuth(true); setMenuOpen(false) }}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                            >Sign in with Google</button>
                        )}
                    </div>
                </div>
            </nav>

            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </>
    )
}