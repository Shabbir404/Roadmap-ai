import { useAuth } from '../contexts/AuthContext.jsx'

export default function AuthModal({ onClose }) {
    const { signInWithGoogle } = useAuth()

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 200,
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                }}
            />

            {/* Modal */}
            {/* Modal */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 201,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                pointerEvents: 'none',
            }}>
                <div style={{
                    width: '100%', maxWidth: 400,
                    maxHeight: '90vh', overflowY: 'auto',
                    padding: '40px 32px 32px', borderRadius: 24,
                    background: '#0E0E1A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
                    pointerEvents: 'all',
                    position: 'relative',
                }}>
                </div>

                {/* Close button — top right */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: 14, right: 14,
                        width: 34, height: 34, borderRadius: 99,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
                        fontSize: 16, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                    }}
                >✕</button>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        margin: '0 auto 14px',
                        background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 24,
                    }}>🧭</div>
                    <h2 style={{
                        fontFamily: 'Space Grotesk', fontWeight: 700,
                        fontSize: '1.3rem', color: 'rgba(255,255,255,0.95)',
                        marginBottom: 8, letterSpacing: '-0.03em',
                    }}>
                        Sign in to Path AI
                    </h2>
                    <p style={{
                        fontFamily: 'DM Sans', fontSize: '0.86rem',
                        color: 'rgba(255,255,255,0.38)', lineHeight: 1.65,
                    }}>
                        Save roadmaps, track progress across devices, and never lose your learning data.
                    </p>
                </div>

                {/* Benefits */}
                <div style={{
                    padding: '16px 18px', borderRadius: 14, marginBottom: 24,
                    background: 'rgba(96,165,250,0.06)',
                    border: '1px solid rgba(96,165,250,0.15)',
                }}>
                    {[
                        ['☁️', 'Roadmaps sync across all your devices'],
                        ['📈', 'Progress never lost — even if you clear browser'],
                        ['🔒', 'Your data is private and secure'],
                    ].map(([icon, text]) => (
                        <div key={text} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            marginBottom: 8,
                        }}>
                            <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                            <span style={{
                                fontFamily: 'DM Sans', fontSize: '0.82rem',
                                color: 'rgba(255,255,255,0.5)',
                            }}>{text}</span>
                        </div>
                    ))}
                </div>

                {/* Google Sign In */}
                <button
                    onClick={signInWithGoogle}
                    style={{
                        width: '100%', padding: '14px 20px', borderRadius: 14,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: 12,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        fontFamily: 'Space Grotesk', fontWeight: 600,
                        fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                        e.currentTarget.style.transform = 'translateY(0)'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                {/* Skip option */}
                <button
                    onClick={onClose}
                    style={{
                        width: '100%', marginTop: 12, padding: '10px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: 'DM Sans', fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.25)', transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                >
                    Continue without signing in
                </button>

                {/* Privacy note */}
                <p style={{
                    textAlign: 'center', marginTop: 16,
                    fontFamily: 'DM Sans', fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.15)',
                }}>
                    We never share your data with anyone.
                </p>
            </div>
        </>
    )
}