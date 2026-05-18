import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useProgress } from '../hooks/useProgress.js'
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import NeuralBg from '../components/NeuralBg.jsx'
import PhaseCard from '../components/PhaseCard.jsx'
import CareerCard from '../components/CareerCard.jsx'
import CareerSheet from '../components/CareerSheet.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import { useToast, ToastContainer } from '../components/Toast.jsx'
import { generateResult } from '../utils/ai.js'
import { getTemplateByTopic, templateToRoadmapData } from '../data/templates.js'
import { saveRoadmap, saveRoadmapLocal, getRoadmap, canRefresh, timeUntilRefresh, timeAgo } from '../utils/storage.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthModal from '../components/AuthModal.jsx'
import {
  canGenerateRoadmap,
  incrementRoadmap,
  getRoadmapQuota,
  migrateLegacyLimits,
} from '../utils/generationLimits.js'


function Skeleton() {
  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px' }}>
      <div className="skeleton" style={{ height: 20, width: 120, marginBottom: 32 }} />
      <div className="skeleton" style={{ height: 44, width: '70%', marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 18, width: '90%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 18, width: '75%', marginBottom: 48 }} />
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton" style={{ height: 80, borderRadius: 20, marginBottom: 14 }} />
      ))}
    </div>
  )
}

export default function Result() {
  const [params] = useSearchParams()
  const topic = params.get('topic') || ''
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [pageScaled, setPageScaled] = useState(false)
  const [fromCache, setFromCache] = useState(false)
  const [cachedAt, setCachedAt] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const { toasts, showToast } = useToast()
  const { toggle, isTopicDone, doneCount, totalTopics, percent, phaseProgress, reset } = useProgress(topic, data?.phases)
  const [search, setSearch] = useState('')
  const isReadOnly = params.get('shared') === 'true'
  const isTemplateSource = params.get('source') === 'template'
  const [limitReason, setLimitReason] = useState(null)
  const [genError, setGenError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)
  const [quotaLabel, setQuotaLabel] = useState('')
  const [showAuth, setShowAuth] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    migrateLegacyLimits()
    getRoadmapQuota(user).then(q => setQuotaLabel(q.label))
  }, [user])

  useEffect(() => {
    if (user && limitReason === 'anon_exhausted') {
      setLimitReason(null)
      setRetryKey(k => k + 1)
    }
  }, [user, limitReason])

  useEffect(() => {
    if (!topic) return
    setLoading(true)
    setData(null)
    setGenError(null)
    setLimitReason(null)

    // Check shared link first
    const sharedData = params.get('data')
    if (sharedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(sharedData)))
        setData(decoded)
        setFromCache(false)
        setLoading(false)
        return
      } catch { }
    }

    // Async load
    const load = async () => {
      try {
        // Built-in templates: static data only — never call Gemini
        if (isTemplateSource) {
          const builtIn = getTemplateByTopic(topic)
          if (!builtIn) {
            setGenError(`Template not found for "${topic}".`)
            setLoading(false)
            return
          }
          const templateData = templateToRoadmapData(builtIn)
          saveRoadmapLocal(topic, templateData)
          setData(templateData)
          setFromCache(true)
          setCachedAt(Date.now())
          setLoading(false)
          return
        }

        const cached = await getRoadmap(topic)
        if (cached?.data) {
          setData(cached.data)
          setFromCache(true)
          setCachedAt(cached.last_generated_at || cached.lastGeneratedAt)
          setLoading(false)
          return
        }

        if (!canGenerateRoadmap(user)) {
          const q = await getRoadmapQuota(user)
          setLimitReason(user ? 'auth_exhausted' : 'anon_exhausted')
          setLoading(false)
          return
        }

        const d = await generateResult(topic)
        await incrementGeneration()
        try {
          await saveRoadmap(topic, d)
        } catch (err) {
          console.error('Cloud save failed:', err.message)
        }
        setData(d)

        setFromCache(false)
        setCachedAt(Date.now())
        setLoading(false)
        const q = await getRoadmapQuota(user)
        setQuotaLabel(q.label)
        showToast(`✨ Roadmap saved! ${q.label}.`, 'success')
      } catch (e) {
        console.error('Roadmap load/generate failed:', e)
        const msg = e?.message || 'Failed to generate roadmap.'
        setGenError(msg.includes('parse') ? `${msg} Try again — if it keeps failing, try a shorter search term.` : msg)
        setLoading(false)
        showToast(e?.message || 'AI generation failed', 'error')
      }
    }

    load()
  }, [topic, retryKey, isTemplateSource, user])

  function openCareer(career) {
    setSelectedCareer(career)
    setPageScaled(true)
  }

  function handleShare() {
    try {
      const payload = JSON.stringify(data)
      const encoded = btoa(encodeURIComponent(payload))
      const url = `${window.location.origin}/result?topic=${encodeURIComponent(topic)}&shared=true&data=${encoded}`
      navigator.clipboard.writeText(url)
      showToast('🔗 Share link copied! Anyone with this link sees your exact roadmap.', 'success')
    } catch {
      showToast('Failed to copy link', 'warn')
    }
  }

  function closeCareer() {
    setSelectedCareer(null)
    setPageScaled(false)
  }

  async function handleRefresh() {
    const ok = await canRefresh(topic)
    if (!ok) return
    setRefreshing(true)
    setGenError(null)
    try {
      const d = await generateResult(topic)
      try {
        await saveRoadmap(topic, d)
      } catch (err) {
        console.error('Cloud save failed:', err.message)
      }
      setData(d)
      setFromCache(false)
      setCachedAt(Date.now())
      showToast('Roadmap refreshed', 'success')
    } catch (e) {
      setGenError(e?.message || 'Refresh failed')
      showToast(e?.message || 'Refresh failed', 'error')
    } finally {
      setRefreshing(false)
    }
  }

  return (

    <div style={{ minHeight: '100vh', background: '#080810', position: 'relative' }}>
      <NeuralBg />

      {/* Orbs */}
      <div style={{ position: 'fixed', top: -200, left: -150, width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle,rgba(59,130,246,0.1),transparent 70%)' }} />
      <div style={{ position: 'fixed', bottom: -150, right: -100, width: 500, height: 500, borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle,rgba(139,92,246,0.08),transparent 70%)' }} />

      {/* Navbar */}
      <Navbar rightContent={
        !loading && totalTopics > 0 ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 99,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              width: 50, height: 3, borderRadius: 99,
              background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 99, width: `${percent}%`,
                background: percent === 100
                  ? 'linear-gradient(90deg,#10B981,#34D399)'
                  : 'linear-gradient(90deg,#3B82F6,#8B5CF6)',
              }} />
            </div>
            <span style={{
              fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.75rem',
              color: percent === 100 ? '#10B981' : 'rgba(255,255,255,0.5)',
            }}>
              {percent === 100 ? '🎉' : `${percent}%`}
            </span>
          </div>
        ) : null
      } />

      {/* Main content — scales down when sheet is open (iOS effect) */}
      <div
        style={{
          position: 'relative', zIndex: 10, paddingTop: 72,
          transition: 'transform 0.4s cubic-bezier(0.32,0.72,0,1), border-radius 0.4s ease',
          transform: pageScaled ? 'scale(0.93) translateY(-20px)' : 'scale(1) translateY(0)',
          transformOrigin: 'top center',
          borderRadius: pageScaled ? 28 : 0,
          overflow: pageScaled ? 'hidden' : 'visible',
        }}
      >
        {/* Read-only watermark banner */}
        {isReadOnly && (
          <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 200, display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 24px', borderRadius: 99,
            background: 'rgba(8,8,16,0.95)',
            border: '1px solid rgba(96,165,250,0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}>
            <span style={{ fontSize: 16 }}>🧭</span>
            <span style={{ fontFamily: 'DM Sans', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
              Made with
            </span>
            <span style={{
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.9rem',
              background: 'linear-gradient(135deg,#60A5FA,#A78BFA)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Path AI</span>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
            <button
              onClick={() => window.open('/', '_blank')}
              style={{
                background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                padding: '5px 14px', fontFamily: 'Space Grotesk',
                fontSize: '0.78rem', fontWeight: 600, color: 'white',
              }}
            >
              Create yours →
            </button>
          </div>
        )}

        {loading ? (
          <LoadingScreen topic={topic} />
        ) : genError ? (
          <div style={{
            minHeight: '80vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 24px', textAlign: 'center',
            position: 'relative', zIndex: 10,
          }}>
            <div style={{ fontSize: 56, marginBottom: 24 }}>⚠️</div>
            <h2 style={{
              fontFamily: 'Space Grotesk', fontWeight: 700,
              fontSize: 'clamp(1.5rem,3vw,2rem)',
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '-0.03em', marginBottom: 12,
            }}>
              Couldn't Generate Roadmap
            </h2>
            <p style={{
              fontFamily: 'DM Sans', fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.45)', lineHeight: 1.75,
              maxWidth: 480, marginBottom: 28,
            }}>
              {genError}
            </p>
            <p style={{
              fontFamily: 'DM Sans', fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.28)', lineHeight: 1.6,
              maxWidth: 420, marginBottom: 32,
            }}>
              Local dev: add <code style={{ color: '#60A5FA' }}>GEMINI_API_KEY</code> to a <code style={{ color: '#60A5FA' }}>.env</code> file.
              Production: set <code style={{ color: '#60A5FA' }}>GEMINI_API_KEY</code> (and optional <code style={{ color: '#60A5FA' }}>GEMINI_MODEL</code>) in Vercel → Settings → Environment Variables, then redeploy.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => setRetryKey(k => k + 1)}
                style={{
                  padding: '12px 28px', borderRadius: 99, cursor: 'pointer',
                  background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                  border: 'none', fontFamily: 'Space Grotesk',
                  fontSize: '0.9rem', fontWeight: 600, color: 'white',
                }}
              >Try Again</button>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '12px 24px', borderRadius: 99, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'DM Sans', fontSize: '0.88rem',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >← Back to Home</button>
            </div>
          </div>
        ) : limitReason ? (
          <div style={{
            minHeight: '80vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 24px', textAlign: 'center',
            position: 'relative', zIndex: 10,
          }}>
            <div style={{ fontSize: 56, marginBottom: 24 }}>
              {limitReason === 'anon_exhausted' ? '🔐' : '⏳'}
            </div>
            <h2 style={{
              fontFamily: 'Space Grotesk', fontWeight: 700,
              fontSize: 'clamp(1.5rem,3vw,2rem)',
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '-0.03em', marginBottom: 12,
            }}>
              {limitReason === 'anon_exhausted' ? 'Sign in to continue' : 'Free limit reached'}
            </h2>
            <p style={{
              fontFamily: 'DM Sans', fontSize: '1rem',
              color: 'rgba(255,255,255,0.4)', lineHeight: 1.75,
              maxWidth: 440, marginBottom: 32,
            }}>
              {limitReason === 'anon_exhausted'
                ? 'You used your 1 free roadmap (and 1 career path) without signing in. Sign in with Google to unlock 2 more AI roadmaps. Career paths are unlimited after sign-in.'
                : 'You used all 3 free AI roadmaps (1 before sign-in + 2 after). Templates are always free. Browse saved roadmaps or templates below.'}
            </p>
            {limitReason === 'anon_exhausted' && (
              <button
                onClick={() => setShowAuth(true)}
                style={{
                  marginBottom: 28, padding: '12px 28px', borderRadius: 99, cursor: 'pointer',
                  background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                  border: 'none', fontFamily: 'Space Grotesk',
                  fontSize: '0.95rem', fontWeight: 600, color: 'white',
                }}
              >Sign in with Google →</button>
            )}

            {/* Options */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 14, width: '100%', maxWidth: 480, marginBottom: 32,
            }}>
              <div style={{
                padding: '20px', borderRadius: 16, textAlign: 'left',
                background: 'rgba(96,165,250,0.08)',
                border: '1px solid rgba(96,165,250,0.2)',
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>📚</div>
                <div style={{
                  fontFamily: 'Space Grotesk', fontWeight: 600,
                  fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', marginBottom: 4,
                }}>View Saved Roadmaps</div>
                <div style={{
                  fontFamily: 'DM Sans', fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.35)',
                }}>Continue your existing learning paths</div>
                <button
                  onClick={() => navigate('/roadmaps')}
                  style={{
                    marginTop: 14, padding: '7px 16px', borderRadius: 8,
                    background: 'rgba(96,165,250,0.15)',
                    border: '1px solid rgba(96,165,250,0.3)',
                    color: '#60A5FA', fontFamily: 'Space Grotesk',
                    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >Go to Roadmaps →</button>
              </div>

              <div style={{
                padding: '20px', borderRadius: 16, textAlign: 'left',
                background: 'rgba(167,139,250,0.08)',
                border: '1px solid rgba(167,139,250,0.2)',
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
                <div style={{
                  fontFamily: 'Space Grotesk', fontWeight: 600,
                  fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', marginBottom: 4,
                }}>Browse Templates</div>
                <div style={{
                  fontFamily: 'DM Sans', fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.35)',
                }}>Explore pre-built learning paths</div>
                <button
                  onClick={() => navigate('/templates')}
                  style={{
                    marginTop: 14, padding: '7px 16px', borderRadius: 8,
                    background: 'rgba(167,139,250,0.15)',
                    border: '1px solid rgba(167,139,250,0.3)',
                    color: '#A78BFA', fontFamily: 'Space Grotesk',
                    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >Browse Templates →</button>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                padding: '10px 24px', borderRadius: 99, cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'DM Sans', fontSize: '0.88rem',
                color: 'rgba(255,255,255,0.4)',
              }}
            >← Back to Home</button>
          </div>
        ) : data ? ( // <-- Fixed: Cleaned up the broken conditional syntax loop split here
          <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>

            {/* Intro section */}
            <div className="fu" style={{ marginBottom: 48 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 14px', borderRadius: 99, marginBottom: 20,
                background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)',
              }}>
                <span style={{ fontSize: 11 }}>📍</span>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.76rem', color: '#60A5FA', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Learning Roadmap
                </span>
              </div>

              <h1 style={{
                fontFamily: 'Space Grotesk', fontWeight: 700,
                fontSize: 'clamp(2rem,4vw,3rem)',
                letterSpacing: '-0.04em', lineHeight: 1.05,
                color: 'rgba(255,255,255,0.95)', marginBottom: 20,
              }}>
                {data.topic}
              </h1>

              <div style={{
                padding: '22px 26px', borderRadius: 18,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>💡</span>
                  <p style={{
                    fontFamily: 'DM Sans', fontSize: '0.97rem',
                    color: 'rgba(255,255,255,0.6)', lineHeight: 1.85,
                  }}>
                    {data.intro}
                  </p>
                </div>
              </div>
            </div>

            {/* Overall Progress */}
            {!isReadOnly && totalTopics > 0 && (
              <div style={{
                padding: '18px 22px', borderRadius: 16, marginBottom: 28,
                background: percent === 100 ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${percent === 100 ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`,
                transition: 'all 0.4s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16 }}>{percent === 100 ? '🎉' : '📈'}</span>
                    <div>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.9rem', color: percent === 100 ? '#10B981' : 'rgba(255,255,255,0.85)' }}>
                        {percent === 100 ? 'Roadmap Complete!' : 'Your Progress'}
                      </div>
                      <div style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>
                        {doneCount} of {totalTopics} topics completed
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.3rem', color: percent === 100 ? '#10B981' : '#60A5FA' }}>
                      {percent}%
                    </span>
                    {doneCount > 0 && (
                      <button
                        onClick={reset}
                        style={{
                          padding: '3px 10px', borderRadius: 8, cursor: 'pointer',
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                          fontFamily: 'DM Sans', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                      >Reset</button>
                    )}
                  </div>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    width: `${percent}%`,
                    background: percent === 100 ? 'linear-gradient(90deg,#10B981,#34D399)' : 'linear-gradient(90deg,#3B82F6,#8B5CF6)',
                    boxShadow: percent === 100 ? '0 0 10px rgba(16,185,129,0.5)' : '0 0 10px rgba(59,130,246,0.4)',
                    transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                  }} />
                </div>
                {percent === 100 && (
                  <div style={{ textAlign: 'center', marginTop: 10, fontFamily: 'DM Sans', fontSize: '0.82rem', color: 'rgba(16,185,129,0.7)' }}>
                    🚀 Now pick a career path below and go deeper!
                  </div>
                )}
              </div>
            )}

            {/* Phases */}
            <div className="fu1" style={{ marginBottom: 64 }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20 }}>🗺️</span>
                    <h2 style={{
                      fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.25rem',
                      color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em',
                    }}>Your Roadmap</h2>
                    <span style={{
                      padding: '3px 12px', borderRadius: 99, fontSize: '0.75rem',
                      background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)',
                      color: '#60A5FA', fontFamily: 'Space Grotesk',
                    }}>{data.phases?.length} Phases</span>
                  </div>
                  {!isReadOnly && (
                    <button
                      onClick={handleShare}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '8px 16px', borderRadius: 10, cursor: 'pointer',
                        background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)',
                        fontFamily: 'Space Grotesk', fontSize: '0.8rem', fontWeight: 500, color: '#60A5FA',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.15)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.4)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.08)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.2)' }}
                    >🔗 Share Roadmap</button>
                  )}
                </div>

                {/* Search */}
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 14, color: 'rgba(255,255,255,0.25)', pointerEvents: 'none',
                  }}>🔍</span>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search topics..."
                    style={{
                      width: '100%', padding: '10px 16px 10px 38px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 12, color: 'rgba(255,255,255,0.8)',
                      fontFamily: 'DM Sans', fontSize: '0.88rem', outline: 'none',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(255,255,255,0.3)', fontSize: 14,
                      }}
                    >✕</button>
                  )}
                </div>
                {search && (
                  <div style={{
                    fontFamily: 'DM Sans', fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.3)', marginTop: 8, marginBottom: 4,
                  }}>
                    {data.phases.reduce((sum, p) =>
                      sum + p.topics.filter(t =>
                        t.title.toLowerCase().includes(search.toLowerCase()) ||
                        t.description?.toLowerCase().includes(search.toLowerCase())
                      ).length, 0
                    )} topics found for "{search}"
                  </div>
                )}
              </div>

              {(data.phases || [])
                .map(phase => {
                  if (!search.trim()) return phase
                  const filtered = phase.topics.filter(t =>
                    t.title.toLowerCase().includes(search.toLowerCase()) ||
                    t.description?.toLowerCase().includes(search.toLowerCase())
                  )
                  if (filtered.length === 0) return null
                  return { ...phase, topics: filtered }
                })
                .filter(Boolean)
                .map((phase, i) => (
                  <PhaseCard
                    key={phase.id}
                    phase={phase}
                    topic={data.topic}
                    index={i}
                    isTopicDone={isTopicDone}
                    onToggle={toggle}
                    phaseProgress={phaseProgress}
                  />
                ))
              }
            </div>

            {/* Career Paths */}
            <div className="fu2">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>💼</span>
                <h2 style={{
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.25rem',
                  color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em',
                }}>Career Paths</h2>
              </div>
              <p style={{
                fontFamily: 'DM Sans', fontSize: '0.88rem',
                color: 'rgba(255,255,255,0.35)', marginBottom: 28, lineHeight: 1.6,
              }}>
                Click any career to get a dedicated roadmap for that exact goal.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 16,
              }}>
                {(data.careers || []).map((career, i) => (
                  isReadOnly ? (
                    <div
                      key={career.id}
                      style={{
                        padding: '24px', borderRadius: 20, position: 'relative',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        position: 'absolute', inset: 0, zIndex: 2,
                        backdropFilter: 'blur(6px)',
                        background: 'rgba(8,8,16,0.6)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: 12, padding: 20, textAlign: 'center',
                        borderRadius: 20,
                      }}>
                        <span style={{ fontSize: 24 }}>🔒</span>
                        <div style={{
                          fontFamily: 'Space Grotesk', fontWeight: 600,
                          fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)',
                        }}>Generate to unlock career paths</div>
                        <button
                          onClick={() => window.open('/', '_blank')}
                          style={{
                            background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
                            border: 'none', borderRadius: 10, cursor: 'pointer',
                            padding: '8px 20px', fontFamily: 'Space Grotesk',
                            fontSize: '0.82rem', fontWeight: 600, color: 'white',
                          }}
                        >✦ Try Path AI Free</button>
                      </div>
                      <div style={{ filter: 'blur(2px)', pointerEvents: 'none' }}>
                        <div style={{ fontSize: 28, marginBottom: 10 }}>{career.emoji}</div>
                        <div style={{
                          fontFamily: 'Space Grotesk', fontWeight: 700,
                          fontSize: '1rem', color: 'rgba(255,255,255,0.9)', marginBottom: 6,
                        }}>{career.title}</div>
                        <div style={{
                          fontFamily: 'DM Sans', fontSize: '0.82rem',
                          color: 'rgba(255,255,255,0.35)', marginBottom: 16,
                        }}>{career.description}</div>
                        <div style={{
                          fontFamily: 'Space Grotesk', fontWeight: 700,
                          fontSize: '0.9rem', color: '#60A5FA',
                        }}>{career.salary}</div>
                      </div>
                    </div>
                  ) : (
                    <CareerCard key={career.id} career={career} index={i} onClick={openCareer} />
                  )
                ))}
              </div>
            </div>

            <Footer />
          </div>
        ) : null} {/* <-- Fixed: Added structural parenthesis layout close sequence here */}
      </div>

      {/* ── iPhone sheet ── */}
      {
        selectedCareer && (
          <CareerSheet
            career={selectedCareer}
            topic={data?.topic || topic}
            onClose={closeCareer}
            fromTemplate={isTemplateSource}
          />
        )
      }
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <ToastContainer toasts={toasts} />

    </div >
  )
}

