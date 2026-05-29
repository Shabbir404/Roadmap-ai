import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthModal from './AuthModal.jsx'
import ConfirmModal from './ConfirmModal.jsx'

export default function Navbar({ rightContent }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, signOut } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const [showAuth, setShowAuth] = useState(false)
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        setMenuOpen(false)
        document.body.style.overflow = ''
    }, [location.pathname])

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    const links = [
        { label: 'Home', path: '/' },
        { label: 'Roadmaps', path: '/roadmaps' },
        { label: 'Templates', path: '/templates' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <>
            <header className={`app-navbar ${scrolled ? 'app-navbar--scrolled' : ''}`}>
                <div className="app-navbar-inner">
                    <button type="button" className="app-navbar-brand" onClick={() => navigate('/')}>
                        <span className="app-navbar-logo">🧭</span>
                        <span className="app-navbar-title">
                            Path <span className="app-navbar-accent">AI</span>
                        </span>
                    </button>

                    <nav className="app-navbar-links desktop-nav" aria-label="Main">
                        {links.map(link => (
                            <button
                                key={link.path}
                                type="button"
                                className={`nav-link ${isActive(link.path) ? 'nav-link--active' : ''}`}
                                onClick={() => navigate(link.path)}
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    <div className="app-navbar-actions">
                        {rightContent && (
                            <div className="app-navbar-extra desktop-nav">{rightContent}</div>
                        )}

                        <div className="desktop-nav app-navbar-auth">
                            {user ? (
                                <>
                                    <div className="nav-user-chip" title={user.email}>
                                        <span className="nav-user-avatar">{user.email?.[0]?.toUpperCase()}</span>
                                        <span className="nav-user-email">{user.email}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="nav-btn-ghost"
                                        onClick={() => setShowSignOutConfirm(true)}
                                    >
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <button type="button" className="btn-primary nav-btn-signin" onClick={() => setShowAuth(true)}>
                                    Sign in
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            className={`mobile-menu-btn ${menuOpen ? 'mobile-menu-btn--open' : ''}`}
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen(o => !o)}
                        >
                            <span /><span /><span />
                        </button>
                    </div>
                </div>

                <div className={`app-navbar-mobile ${menuOpen ? 'app-navbar-mobile--open' : ''}`}>
                    <nav className="app-navbar-mobile-nav" aria-label="Mobile">
                        {links.map(link => (
                            <button
                                key={link.path}
                                type="button"
                                className={`nav-link-mobile ${isActive(link.path) ? 'nav-link-mobile--active' : ''}`}
                                onClick={() => navigate(link.path)}
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>
                    {rightContent && <div className="app-navbar-mobile-extra">{rightContent}</div>}
                    <div className="app-navbar-mobile-auth">
                        {user ? (
                            <>
                                <p className="nav-mobile-signed">Signed in as <strong>{user.email}</strong></p>
                                <button type="button" className="nav-btn-danger" onClick={() => setShowSignOutConfirm(true)}>
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <button type="button" className="btn-primary nav-btn-signin-full" onClick={() => { setShowAuth(true); setMenuOpen(false) }}>
                                Sign in with Google
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {menuOpen && <button type="button" className="app-navbar-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
            <ConfirmModal
                open={showSignOutConfirm}
                title="Sign out?"
                message="Your roadmaps and progress stay saved in your account. You can sign back in anytime."
                confirmLabel="Sign out"
                cancelLabel="Stay signed in"
                danger
                onConfirm={() => { setShowSignOutConfirm(false); signOut() }}
                onCancel={() => setShowSignOutConfirm(false)}
            />
        </>
    )
}
