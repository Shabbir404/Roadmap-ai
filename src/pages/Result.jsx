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
import { saveRoadmap, getRoadmap, canRefresh, timeUntilRefresh, timeAgo } from '../utils/storage.js'

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

  useEffect(() => {
    if (!topic) return
    setLoading(true)
    setData(null)

    const cached = getRoadmap(topic)
    if (cached) {
      // load from cache instantly
      setData(cached.data)
      setFromCache(true)
      setCachedAt(cached.lastGeneratedAt)
      setLoading(false)
    } else {
      // call API
      generateResult(topic).then(d => {
        setData(d)
        saveRoadmap(topic, d)
        setFromCache(false)
        setLoading(false)
      })
    }
  }, [topic])

  function openCareer(career) {
    setSelectedCareer(career)
    setPageScaled(true)
  }

  function closeCareer() {
    setSelectedCareer(null)
    setPageScaled(false)
  }

  async function handleRefresh() {
    if (!canRefresh(topic)) return
    setRefreshing(true)
    const d = await generateResult(topic)
    saveRoadmap(topic, d)
    setData(d)
    setFromCache(false)
    setCachedAt(Date.now())
    setRefreshing(false)
  }

  return (

    <div style={{ minHeight: '100vh', background: '#080810', position: 'relative' }}>
      <NeuralBg />

      {/* Orbs */}
      <div style={{ position: 'fixed', top: -200, left: -150, width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle,rgba(59,130,246,0.1),transparent 70%)' }} />
      <div style={{ position: 'fixed', bottom: -150, right: -100, width: 500, height: 500, borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle,rgba(139,92,246,0.08),transparent 70%)' }} />

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

        {/* Center nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { label: 'Home', path: '/' },
            { label: 'Roadmaps', path: '/roadmaps' },
          ].map(link => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans', fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.4)',
                padding: '6px 14px', borderRadius: 8, transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >{link.label}</button>
          ))}
        </div>

        {/* Right side — progress pill + new search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!loading && totalTopics > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 99,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{
                width: 70, height: 4, borderRadius: 99,
                background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 99, width: `${percent}%`,
                  background: 'linear-gradient(90deg,#3B82F6,#8B5CF6)',
                  transition: 'width 0.4s ease',
                }} />
              </div>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                {percent}%
              </span>
            </div>
          )}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 18px', borderRadius: 99, cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Sans', fontSize: '0.85rem',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
          >← New Search</button>
        </div>
      </nav>

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
        {loading ? <LoadingScreen topic={topic} /> : data ? (
          <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>

            {/* ── Intro section ── */}
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

              {/* Intro paragraph */}
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
            {/* Cache badge */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 20, flexWrap: 'wrap', gap: 10,
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', borderRadius: 99,
                background: fromCache ? 'rgba(167,139,250,0.08)' : 'rgba(16,185,129,0.08)',
                border: `1px solid ${fromCache ? 'rgba(167,139,250,0.2)' : 'rgba(16,185,129,0.2)'}`,
              }}>
                <span style={{ fontSize: 12 }}>{fromCache ? '⚡' : '✨'}</span>
                <span style={{
                  fontFamily: 'Space Grotesk', fontSize: '0.78rem', fontWeight: 500,
                  color: fromCache ? '#A78BFA' : '#10B981',
                }}>
                  {fromCache ? `Saved ${timeAgo(cachedAt)}` : 'Just generated · Auto-saved'}
                </span>
              </div>

              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={!canRefresh(topic) || refreshing}
                style={{
                  padding: '6px 16px', borderRadius: 99, cursor: canRefresh(topic) ? 'pointer' : 'not-allowed',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'DM Sans', fontSize: '0.78rem',
                  color: canRefresh(topic) ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {refreshing ? '⏳ Refreshing...' : canRefresh(topic) ? '🔄 Refresh Roadmap' : `🔒 Regenerate the roadmap for "${(topic)}" in ${timeUntilRefresh(topic)}`}
              </button>
            </div>

            {/* Overall Progress */}
            {totalTopics > 0 && (
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
                      >
                        Reset
                      </button>
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


            {/* ── Phases ── */}
            <div className="fu1" style={{ marginBottom: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 20 }}>🗺️</span>
                <h2 style={{
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.25rem',
                  color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em',
                }}>
                  Your Roadmap
                </h2>
                <span style={{
                  padding: '3px 12px', borderRadius: 99, fontSize: '0.75rem',
                  background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)',
                  color: '#60A5FA', fontFamily: 'Space Grotesk',
                }}>
                  {data.phases?.length} Phases
                </span>
              </div>

              {(data.phases || []).map((phase, i) => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  topic={data.topic}
                  index={i}
                  isTopicDone={isTopicDone}
                  onToggle={toggle}
                  phaseProgress={phaseProgress}
                />
              ))}
            </div>

            {/* ── Career Paths ── */}
            <div className="fu2">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>💼</span>
                <h2 style={{
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.25rem',
                  color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em',
                }}>
                  Career Paths
                </h2>
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
                  <CareerCard key={career.id} career={career} index={i} onClick={openCareer} />
                ))}
              </div>
            </div>

          </div>
        ) : null}
      </div>

      {/* ── iPhone sheet ── */}
      {selectedCareer && (
        <CareerSheet
          career={selectedCareer}
          topic={data?.topic || topic}
          onClose={closeCareer}
        />
      )}
      <ToastContainer toasts={toasts} />

    </div>
  )
}
