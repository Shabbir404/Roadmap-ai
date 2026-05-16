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
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                }}
            />

            {/* Modal */}
            <div style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                zIndex: 201, width: '100%', maxWidth: 420,
                padding: '40px 36px', borderRadius: 24,
                background: '#0E0E1A',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14, margin: '0 auto 16px',
                        background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24,
                    }}>🧭</div>
                    <h2 style={{
                        fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.4rem',
                        color: 'rgba(255,255,255,0.95)', marginBottom: 8,
                        letterSpacing: '-0.03em',
                    }}>
                        Sign in to Path AI
                    </h2>
                    <p style={{
                        fontFamily: 'DM Sans', fontSize: '0.88rem',
                        color: 'rgba(255,255,255,0.38)', lineHeight: 1.6,
                    }}>
                        Save your roadmaps, track progress across devices, and never lose your learning data.
                    </p>
                </div>

                {/* Google Sign In */}
                <button
                    onClick={signInWithGoogle}
                    style={{
                        width: '100%', padding: '14px 20px', borderRadius: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        fontFamily: 'Space Grotesk', fontWeight: 600,
                        fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                    }}
                >
                    {/* Google icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                {/* Privacy note */}
                <p style={{
                    textAlign: 'center', marginTop: 20,
                    fontFamily: 'DM Sans', fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.2)',
                }}>
                    By signing in you agree to our terms. We never share your data.
                </p>

                {/* Close */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: 16, right: 16,
                        width: 32, height: 32, borderRadius: 99,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
                        fontSize: 16, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                    }}
                >✕</button>
            </div>
        </>
    )
}