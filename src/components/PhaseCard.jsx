import { useState } from 'react'

export default function PhaseCard({ phase, topic, index, isTopicDone, onToggle, phaseProgress }) {
  const [open, setOpen] = useState(index === 0)

  function ytLink(topicTitle) {
    const q = encodeURIComponent(`${topicTitle} ${topic} tutorial`)
    return `https://www.youtube.com/results?search_query=${q}&sp=EgIIBQ%253D%253D`
  }

  const progress = phaseProgress ? phaseProgress(phase.id, phase.topics) : { completed: 0, total: phase.topics?.length || 0, percent: 0 }
  const allDone = progress.completed === progress.total && progress.total > 0

  return (
    <div
      className="phase-card fu"
      style={{
        animationDelay: `${index * 0.07}s`,
        borderColor: allDone ? `${phase.color}50` : undefined,
      }}
    >
      {/* Header */}
      <button className="phase-header" onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
            background: allDone ? `${phase.color}30` : `${phase.color}18`,
            border: `1px solid ${allDone ? phase.color : phase.color + '35'}`,
          }}>
            {allDone ? '✅' : phase.emoji}
          </div>

          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.72rem',
                color: phase.color, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>Phase {phase.id}</span>
              <span style={{
                padding: '2px 10px', borderRadius: 99, fontSize: '0.7rem',
                background: `${phase.color}14`, border: `1px solid ${phase.color}30`,
                color: phase.color, fontFamily: 'Space Grotesk',
              }}>{phase.duration}</span>
              {allDone && (
                <span style={{
                  padding: '2px 10px', borderRadius: 99, fontSize: '0.7rem',
                  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                  color: '#10B981', fontFamily: 'Space Grotesk',
                }}>✓ Complete</span>
              )}
            </div>

            <div style={{
              fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1rem',
              color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.02em',
            }}>{phase.title}</div>

            {!open && (
              <div style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>
                {phase.summary}
              </div>
            )}

            {/* Phase progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
              <div style={{
                width: 120, height: 3, borderRadius: 99,
                background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  width: `${progress.percent}%`,
                  background: allDone
                    ? 'linear-gradient(90deg,#10B981,#34D399)'
                    : `linear-gradient(90deg,${phase.color},${phase.color}aa)`,
                  transition: 'width 0.4s ease',
                }} />
              </div>
              <span style={{
                fontFamily: 'Space Grotesk', fontSize: '0.68rem',
                color: allDone ? '#10B981' : 'rgba(255,255,255,0.28)',
              }}>{progress.completed}/{progress.total}</span>
            </div>

            {open && (
              <div style={{
                fontFamily: 'DM Sans', fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.18)', marginTop: 4,
              }}>
                ✓ Click any topic row to mark complete
              </div>
            )}
          </div>
        </div>

        <div style={{
          width: 32, height: 32, borderRadius: 99, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          fontSize: 12, color: 'rgba(255,255,255,0.4)',
          transition: 'transform 0.3s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>▼</div>
      </button>

      {/* Topics */}
      {open && (
        <div style={{ padding: '0 24px 20px' }}>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 12 }} />
          {(phase.topics || []).map((topic_item) => {
            const done = isTopicDone ? isTopicDone(phase.id, topic_item.id) : false
            return (
              <div
                key={topic_item.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', borderRadius: 12, marginBottom: 8,
                  background: done ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'}`,
                  transition: 'all 0.2s ease', cursor: 'pointer',
                }}
                onClick={() => onToggle && onToggle(phase.id, topic_item.id)}
              >
                {/* Checkbox */}
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? '#10B981' : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${done ? '#10B981' : 'rgba(255,255,255,0.15)'}`,
                  fontSize: 11, color: 'white',
                  transition: 'all 0.2s ease',
                }}>
                  {done ? '✓' : ''}
                </div>

                {/* YouTube link — stops row click from triggering */}
                <a
                  href={ytLink(topic_item.title)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    flex: 1, minWidth: 0, textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${phase.color}18`, border: `1px solid ${phase.color}30`,
                    fontSize: 10, color: phase.color,
                  }}>▶</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.88rem',
                      color: done ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.82)',
                      textDecoration: done ? 'line-through' : 'none',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{topic_item.title}</div>
                    {topic_item.description && (
                      <div style={{
                        fontFamily: 'DM Sans', fontSize: '0.76rem',
                        color: 'rgba(255,255,255,0.28)', marginTop: 1,
                      }}>{topic_item.description}</div>
                    )}
                  </div>

                  <div style={{
                    flexShrink: 0, padding: '2px 9px', borderRadius: 5,
                    background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.18)',
                    fontSize: '0.68rem', color: '#FF6B6B', fontFamily: 'Space Grotesk',
                  }}>YT →</div>
                </a>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}