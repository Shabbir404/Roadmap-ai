import { useAuth } from '../contexts/AuthContext.jsx'
import AuthModal from '../components/AuthModal.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NeuralBg from '../components/NeuralBg.jsx'
import Footer from '../components/Footer.jsx'
import { getAllRoadmaps, timeAgo, getStandaloneProgress } from '../utils/storage.js'


const SUGGESTIONS = ['Python', 'React', 'Machine Learning', 'UI/UX Design', 'Web3', 'Data Science']

const HOW_IT_WORKS = [
  {
    step: '01', emoji: '🔍', title: 'Search a Skill',
    desc: 'Type any topic — Python, Design, Machine Learning, anything. Our AI knows them all.',
    color: '#3B82F6',
  },
  {
    step: '02', emoji: '🧠', title: 'AI Builds Your Roadmap',
    desc: 'Gemini AI generates a structured, phased learning path with real YouTube video links.',
    color: '#8B5CF6',
  },
  {
    step: '03', emoji: '📈', title: 'Track Your Progress',
    desc: 'Check off topics as you complete them. Your progress saves automatically.',
    color: '#2DD4BF',
  },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const [recentRoadmaps, setRecentRoadmaps] = useState([])
  useEffect(() => {
    getAllRoadmaps().then(all => setRecentRoadmaps(all.slice(0, 3)))
  }, [])

  const { user, signOut } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)

  const [globalStats, setGlobalStats] = useState({ total: 0, completedTopics: 0 })
  useEffect(() => {
    getAllRoadmaps().then(all => {
      const completedTopics = all.reduce((sum, rm) => {
        return sum + Object.keys(getStandaloneProgress(rm.topic)).length
      }, 0)
      setGlobalStats({ total: all.length, completedTopics })
    })
  }, [])

  function go(q) {
    const t = (q || query).trim()
    if (!t) return
    navigate(`/result?topic=${encodeURIComponent(t)}`)
  }

  function onKey(e) {
    if (e.key === 'Enter') go()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080810', position: 'relative', overflow: 'hidden' }}>
      <NeuralBg />

      {/* Orbs */}
      <div style={{ position: 'fixed', top: -200, left: -150, width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle,rgba(59,130,246,0.12),transparent 70%)' }} />
      <div style={{ position: 'fixed', bottom: -150, right: -100, width: 500, height: 500, borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle,rgba(139,92,246,0.09),transparent 70%)' }} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px',
        background: 'rgba(8,8,16,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
          }}>🧭</div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.05rem', color: 'rgba(255,255,255,0.92)' }}>
            Path <span style={{ color: '#60A5FA' }}>AI</span>
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[
            { label: 'Home', path: '/' },
            { label: 'Roadmaps', path: '/roadmaps' },
            { label: 'Demandable', path: '/templates' },
          ].map(link => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans', fontSize: '0.9rem',
                color: link.path === '/' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                padding: '6px 14px', borderRadius: 8, transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
              onMouseLeave={e => e.currentTarget.style.color = link.path === '/' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)'}
            >{link.label}</button>
          ))}
        </div>

        {globalStats.total > 0 && (
          <button
            onClick={() => navigate('/roadmaps')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 99, cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)'
              e.currentTarget.style.background = 'rgba(96,165,250,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            }}
          >
            <span style={{ fontSize: 13 }}>🗺️</span>
            <span style={{
              fontFamily: 'Space Grotesk', fontWeight: 600,
              fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)',
            }}>
              {globalStats.total} roadmap{globalStats.total !== 1 ? 's' : ''}
            </span>
            {globalStats.completedTopics > 0 && (
              <>
                <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
                <span style={{
                  fontFamily: 'Space Grotesk', fontWeight: 600,
                  fontSize: '0.78rem', color: '#10B981',
                }}>
                  {globalStats.completedTopics} ✓
                </span>
              </>
            )}
          </button>
        )}
        {/* Auth button */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 99,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 99,
                background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: 'white', fontWeight: 700,
                fontFamily: 'Space Grotesk',
              }}>
                {user.email?.[0].toUpperCase()}
              </div>
              <span style={{
                fontFamily: 'DM Sans', fontSize: '0.82rem',
                color: 'rgba(255,255,255,0.5)',
                maxWidth: 120, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {user.email}
              </span>
            </div>
            <button
              onClick={() => setShowSignOutConfirm(true)}
              style={{
                padding: '6px 14px', borderRadius: 99, cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'DM Sans', fontSize: '0.82rem',
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
            style={{ padding: '8px 20px' }}
          >
            Sign in
          </button>
        )}

        {/* Auth Modal */}
        <div style={{
          padding: '6px 16px', borderRadius: 99,
          background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
          fontFamily: 'Space Grotesk', fontSize: '0.78rem', color: '#60A5FA', fontWeight: 500,
        }}>
          ⚡ Developed by Shabbir
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        position: 'relative', zIndex: 10,
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 60px', textAlign: 'center',
      }}>
        <div className="fu" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 18px', borderRadius: 99, marginBottom: 28,
          background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)',
        }}>
          <span style={{ fontSize: 12 }}>✦</span>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.78rem', color: '#A78BFA', fontWeight: 500 }}>
            AI Learning Roadmaps with Video Links
          </span>
        </div>

        <h1 className="fu1" style={{
          fontFamily: 'Space Grotesk', fontWeight: 700,
          fontSize: 'clamp(2.8rem,6vw,5rem)',
          lineHeight: 1.04, letterSpacing: '-0.04em',
          color: 'rgba(255,255,255,0.95)', marginBottom: 18,
        }}>
          Your Learning<br />
          <span style={{
            background: 'linear-gradient(135deg,#60A5FA 0%,#A78BFA 50%,#2DD4BF 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Compass</span>
        </h1>

        <p className="fu2" style={{
          fontFamily: 'DM Sans', fontSize: '1.05rem', lineHeight: 1.75,
          color: 'rgba(255,255,255,0.38)', maxWidth: 460, marginBottom: 48,
        }}>
          Type any skill. Get a rich, structured roadmap with phases, YouTube links, and career paths. All in seconds.
        </p>

        {/* Search */}
        <div className="fu3 search-wrap">
          <span style={{
            position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
            fontSize: 20, color: 'rgba(96,165,250,0.6)', pointerEvents: 'none', zIndex: 1,
          }}>🔍</span>
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="What do you want to learn today?"
          />
          <button
            className="btn-primary"
            onClick={() => go()}
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: '10px 22px' }}
          >
            ✦ Generate
          </button>
        </div>

        {/* Suggestions */}
        <div className="fu4" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20, justifyContent: 'center' }}>
          <span style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color: 'rgba(255,255,255,0.18)', alignSelf: 'center' }}>Try:</span>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => go(s)}
              style={{
                fontFamily: 'DM Sans', fontSize: '0.8rem',
                padding: '5px 15px', borderRadius: 99, cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.38)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.08)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.25)'; e.currentTarget.style.color = '#60A5FA' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.38)' }}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ position: 'relative', zIndex: 10, padding: '80px 24px', maxWidth: 900, margin: '0 auto', }}>
        <div className="fu" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 16px', borderRadius: 99, marginBottom: 16,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              How it works
            </span>
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk', fontWeight: 700,
            fontSize: 'clamp(1.6rem,3vw,2.2rem)',
            color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.03em',
          }}>
            From zero to roadmap in seconds
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {HOW_IT_WORKS.map((item, i) => (
            <div
              key={item.step}
              className="fu"
              style={{
                animationDelay: `${i * 0.1}s`,
                padding: '28px 24px', borderRadius: 20,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Step number background */}
              <div style={{
                position: 'absolute', top: 16, right: 20,
                fontFamily: 'Space Grotesk', fontWeight: 800,
                fontSize: '4rem', color: 'rgba(255,255,255,0.03)',
                lineHeight: 1, userSelect: 'none',
              }}>{item.step}</div>

              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
                background: `${item.color}18`,
                border: `1px solid ${item.color}30`,
              }}>{item.emoji}</div>

              <div style={{
                fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem',
                color: 'rgba(255,255,255,0.88)', marginBottom: 10, letterSpacing: '-0.02em',
              }}>{item.title}</div>

              <div style={{
                fontFamily: 'DM Sans', fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.35)', lineHeight: 1.7,
              }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Roadmaps */}
      {recentRoadmaps.length > 0 && (
        <div style={{ position: 'relative', zIndex: 10, padding: '0 24px 80px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.02em',
            }}>
              📚 Continue Learning
            </h2>
            <button
              onClick={() => navigate('/roadmaps')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans', fontSize: '0.82rem', color: '#60A5FA',
              }}
            >
              View all →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {recentRoadmaps.map((rm, i) => {
              const totalTopics = rm.data?.phases?.reduce((s, p) => s + (p.topics?.length || 0), 0) || 0
              const doneCount = Object.keys(rm.progress || {}).length
              const percent = totalTopics > 0 ? Math.round((doneCount / totalTopics) * 100) : 0

              return (
                <div
                  key={rm.topic}
                  onClick={() => navigate(`/result?topic=${encodeURIComponent(rm.topic)}`)}
                  style={{
                    padding: '20px', borderRadius: 16, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' }}>
                      {rm.topic}
                    </span>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.85rem', color: percent === 100 ? '#10B981' : '#60A5FA' }}>
                      {percent}%
                    </span>
                  </div>
                  <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{
                      height: '100%', borderRadius: 99, width: `${percent}%`,
                      background: percent === 100 ? 'linear-gradient(90deg,#10B981,#34D399)' : 'linear-gradient(90deg,#3B82F6,#8B5CF6)',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
                    {doneCount}/{totalTopics} topics · {timeAgo(rm.savedAt)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Footer />

      {/* Auth Modal  */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <ConfirmModal
        open={showSignOutConfirm}
        title="Sign out?"
        message="You'll stay signed in on this device until you confirm. Your saved roadmaps remain in your account."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        danger
        onConfirm={() => { setShowSignOutConfirm(false); signOut() }}
        onCancel={() => setShowSignOutConfirm(false)}
      />

    </div>
  )
}

