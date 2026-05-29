import { useState } from 'react'

function PhaseRow({ phase, topic, index, isTopicDone, onToggle, phaseProgress }) {
    const [open, setOpen] = useState(index === 0)

    function ytLink(t) {
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${t} ${topic} tutorial`)}`
    }

    const progress = phaseProgress
        ? phaseProgress(phase.id, phase.topics)
        : { completed: 0, total: phase.topics?.length || 0, percent: 0 }
    const allDone = progress.completed === progress.total && progress.total > 0

    return (
        <article className={`career-phase ${allDone ? 'career-phase--done' : ''}`} style={{ '--phase-color': phase.color }}>
            <button type="button" className="career-phase-head" onClick={() => setOpen(o => !o)}>
                <div className="career-phase-head-left">
                    <span className="career-phase-emoji">{allDone ? '✅' : phase.emoji}</span>
                    <div>
                        <h3 className="career-phase-title">{phase.title}</h3>
                        <div className="career-phase-meta">
                            <div className="career-phase-mini-bar">
                                <div style={{ width: `${progress.percent}%` }} />
                            </div>
                            <span>{phase.duration} · {progress.completed}/{progress.total}</span>
                        </div>
                    </div>
                </div>
                <span className={`career-phase-chevron ${open ? 'career-phase-chevron--open' : ''}`}>▼</span>
            </button>

            {open && (
                <div className="career-phase-body">
                    {(phase.topics || []).map(t => {
                        const done = isTopicDone?.(phase.id, t.id)
                        return (
                            <div
                                key={t.id}
                                className={`career-topic ${done ? 'career-topic--done' : ''}`}
                                onClick={() => onToggle?.(phase.id, t.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => e.key === 'Enter' && onToggle?.(phase.id, t.id)}
                            >
                                <span className="career-topic-check">{done ? '✓' : ''}</span>
                                <a
                                    href={ytLink(t.title)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="career-topic-link"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <span className="career-topic-play">▶</span>
                                    <span className="career-topic-text">
                                        <strong>{t.title}</strong>
                                        {t.description && <small>{t.description}</small>}
                                    </span>
                                    <span className="career-topic-yt">YouTube</span>
                                </a>
                            </div>
                        )
                    })}
                </div>
            )}
        </article>
    )
}

export default function CareerPhaseList({ phases, topic, isTopicDone, onToggle, phaseProgress }) {
    return (
        <section className="career-phases">
            <h2 className="career-phases-heading">Learning phases</h2>
            {(phases || []).map((phase, i) => (
                <PhaseRow
                    key={phase.id}
                    phase={phase}
                    topic={topic}
                    index={i}
                    isTopicDone={isTopicDone}
                    onToggle={onToggle}
                    phaseProgress={phaseProgress}
                />
            ))}
        </section>
    )
}
