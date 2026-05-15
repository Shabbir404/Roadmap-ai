import { saveCareerRoadmap, getCareerRoadmap } from '../utils/storage.js'
import { useState, useEffect } from 'react'
import { generateCareerRoadmap } from '../utils/ai.js'

function PhaseRow({ phase, topic, index }) {
  const [open, setOpen] = useState(index === 0)

  function ytLink(topicTitle) {
    const q = encodeURIComponent(`${topicTitle} ${topic} tutorial`)
    return `https://www.youtube.com/results?search_query=${q}&sp=EgIIBQ%253D%253D`
  }

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden', marginBottom: 12,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '18px 22px',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, background: `${phase.color}18`, border: `1px solid ${phase.color}30`,
          }}>
            {phase.emoji}
          </div>
          <div>
            <div style={{
              fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.9)',
            }}>
              {phase.title}
            </div>
            <div style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: phase.color, marginTop: 2 }}>
              {phase.duration}
            </div>
          </div>
        </div>
        <span style={{
          color: 'rgba(255,255,255,0.3)', fontSize: 11,
          transform: open ? 'rotate(180deg)' : 'none', transition: '0.3s',
        }}>▼</span>
      </button>

      {open && (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 10 }} />
          {(phase.topics || []).map(t => (
            <a
              key={t.id}
              href={ytLink(t.title)}
              target="_blank"
              rel="noreferrer"
              className="topic-link"
            >
              <div style={{
                width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${phase.color}18`, fontSize: 10, color: phase.color,
              }}>▶</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'DM Sans', fontSize: '0.85rem', color: 'rgba(255,255,255,0.82)' }}>{t.title}</div>
                {t.description && (
                  <div style={{ fontFamily: 'DM Sans', fontSize: '0.74rem', color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{t.description}</div>
                )}
              </div>
              <div style={{
                flexShrink: 0, padding: '2px 8px', borderRadius: 5,
                background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.18)',
                fontSize: '0.68rem', color: '#FF6B6B', fontFamily: 'Space Grotesk',
              }}>YT →</div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CareerSheet({ career, topic, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check cache first
    const cached = getCareerRoadmap(topic, career.title)
    if (cached) {
      setData(cached.data)
      setLoading(false)
      return
    }
    // Not cached — generate and save
    generateCareerRoadmap(topic, career.title).then(d => {
      setData(d)
      saveCareerRoadmap(topic, career.title, d)
      setLoading(false)
    })
  }, [topic, career.title])

  return (
    <>
      {/* Backdrop */}
      <div className="sheet-backdrop" onClick={onClose} />

      {/* Sheet */}
      <div className="sheet-page">
        <div className="sheet-handle" />

        <div style={{ padding: '24px 28px 48px' }}>
          {/* Close + title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, fontSize: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${career.color}18`, border: `1px solid ${career.color}30`,
              }}>
                {career.emoji}
              </div>
              <div>
                <div style={{
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem',
                  color: 'rgba(255,255,255,0.95)',
                }}>
                  {career.title}
                </div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', color: career.color }}>
                  Career Roadmap
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: 99, border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
                fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div className="skeleton" style={{ height: 64, borderRadius: 16, marginBottom: 8 }} />
                </div>
              ))}
              <div style={{
                textAlign: 'center', marginTop: 20, fontFamily: 'DM Sans',
                fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)',
              }}>
                Building your {career.title} roadmap...
              </div>
            </div>
          ) : data ? (
            <div>
              {/* Intro */}
              <div style={{
                padding: '18px 20px', borderRadius: 14, marginBottom: 24,
                background: `${career.color}0D`, border: `1px solid ${career.color}25`,
              }}>
                <p style={{
                  fontFamily: 'DM Sans', fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.65)', lineHeight: 1.75,
                }}>
                  {data.intro}
                </p>
              </div>

              {/* Phases */}
              {(data.phases || []).map((phase, i) => (
                <PhaseRow key={phase.id} phase={phase} topic={topic} index={i} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
