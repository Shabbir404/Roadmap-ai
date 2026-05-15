import { saveCareerRoadmap, getCareerRoadmap } from '../utils/storage.js'
import { useState, useEffect } from 'react'
import { generateCareerRoadmap } from '../utils/ai.js'
import { useProgress } from '../hooks/useProgress.js'

function PhaseRow({ phase, topic, index, isTopicDone, onToggle, phaseProgress }) {
  const [open, setOpen] = useState(index === 0);

  function ytLink(t) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${t} ${topic} tutorial`)}&sp=EgIIBQ%253D%253D`;
  }

  const progress = phaseProgress ? phaseProgress(phase.id, phase.topics) : { completed: 0, total: phase.topics?.length || 0, percent: 0 };
  const allDone = progress.completed === progress.total && progress.total > 0;

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden', marginBottom: 12,
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${allDone ? `${phase.color}40` : 'rgba(255,255,255,0.07)'}`,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '18px 22px',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
            background: allDone ? `${phase.color}30` : `${phase.color}18`,
            border: `1px solid ${allDone ? phase.color : phase.color + '30'}`,
          }}>
            {allDone ? '✅' : phase.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.9)',
            }}>{phase.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <div style={{
                width: 80, height: 3, borderRadius: 99,
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
                fontFamily: 'DM Sans', fontSize: '0.72rem',
                color: allDone ? '#10B981' : phase.color,
              }}>{phase.duration} · {progress.completed}/{progress.total}</span>
            </div>
            {open && (
              <div style={{
                fontFamily: 'DM Sans', fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.18)', marginTop: 3,
              }}>
                ✓ Click any topic to mark complete
              </div>
            )}
          </div>
        </div>
        <span style={{
          color: 'rgba(255,255,255,0.3)', fontSize: 11, flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none', transition: '0.3s',
        }}>▼</span>
      </button>

      {open && (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 10 }} />
          {(phase.topics || []).map(t => {
            const done = isTopicDone ? isTopicDone(phase.id, t.id) : false;
            return (
              <div
                key={t.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, marginBottom: 7,
                  background: done ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)'}`,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                onClick={() => onToggle && onToggle(phase.id, t.id)}
              >
                {/* Checkbox */}
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? '#10B981' : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${done ? '#10B981' : 'rgba(255,255,255,0.15)'}`,
                  fontSize: 10, color: 'white',
                  transition: 'all 0.2s ease',
                }}>
                  {done ? '✓' : ''}
                </div>

                {/* YouTube link fixed below */}
                <a
                  href={ytLink(t.title)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    flex: 1, minWidth: 0, textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${phase.color}18`, fontSize: 10, color: phase.color,
                  }}>▶</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'DM Sans', fontSize: '0.85rem',
                      color: done ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.82)',
                      textDecoration: done ? 'line-through' : 'none',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{t.title}</div>
                    {t.description && (
                      <div style={{
                        fontFamily: 'DM Sans', fontSize: '0.74rem',
                        color: 'rgba(255,255,255,0.3)', marginTop: 1,
                      }}>{t.description}</div>
                    )}
                  </div>

                  <div style={{
                    flexShrink: 0, padding: '2px 8px', borderRadius: 5,
                    background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.18)',
                    fontSize: '0.68rem', color: '#FF6B6B', fontFamily: 'Space Grotesk',
                  }}>YT →</div>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CareerSheet({ career, topic, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const progressKey = `${topic}__${career.title}`
  const { toggle, isTopicDone, doneCount, totalTopics, percent, phaseProgress, reset } = useProgress(progressKey, data?.phases)

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
              {/* Career progress bar */}
              {totalTopics > 0 && (
                <div style={{
                  padding: '14px 18px', borderRadius: 14, marginBottom: 20,
                  background: percent === 100 ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${percent === 100 ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  transition: 'all 0.4s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{percent === 100 ? '🎉' : '📈'}</span>
                      <span style={{
                        fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.85rem',
                        color: percent === 100 ? '#10B981' : 'rgba(255,255,255,0.7)',
                      }}>
                        {percent === 100 ? 'Career Path Complete!' : 'Your Progress'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem',
                        color: percent === 100 ? '#10B981' : '#60A5FA',
                      }}>{percent}%</span>
                      {doneCount > 0 && (
                        <button
                          onClick={reset}
                          style={{
                            padding: '2px 8px', borderRadius: 6, cursor: 'pointer',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                            fontFamily: 'DM Sans', fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)',
                          }}
                        >Reset</button>
                      )}
                    </div>
                  </div>
                  <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 99, width: `${percent}%`,
                      background: percent === 100
                        ? 'linear-gradient(90deg,#10B981,#34D399)'
                        : 'linear-gradient(90deg,#3B82F6,#8B5CF6)',
                      transition: 'width 0.5s ease',
                      boxShadow: percent === 100 ? '0 0 10px rgba(16,185,129,0.5)' : 'none',
                    }} />
                  </div>
                  <div style={{
                    fontFamily: 'DM Sans', fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.25)', marginTop: 6, textAlign: 'right',
                  }}>{doneCount}/{totalTopics} topics</div>
                </div>
              )}

              {(data.phases || []).map((phase, i) => (
                <PhaseRow
                  key={phase.id}
                  phase={phase}
                  topic={topic}
                  index={i}
                  isTopicDone={isTopicDone}
                  onToggle={toggle}
                  phaseProgress={phaseProgress}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
