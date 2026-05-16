export default function CareerCard({ career, onClick, index }) {
  const diffColor = { Easy: '#10B981', Medium: '#F59E0B', Hard: '#EF4444' }
  const mathColor = { Low: '#10B981', Medium: '#F59E0B', High: '#EF4444' }

  return (
    <div
      className="career-card fu"
      style={{ animationDelay: `${index * 0.06}s` }}
      onClick={() => onClick(career)}
    >
      {/* Emoji + title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, background: `${career.color}18`, border: `1px solid ${career.color}30`,
        }}>
          {career.emoji}
        </div>
        <div style={{
          fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)',
          fontFamily: 'Space Grotesk', marginTop: 4,
        }}>
          Click for roadmap →
        </div>
      </div>



      <div style={{
        fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.05rem',
        color: 'rgba(255,255,255,0.92)', marginBottom: 6, letterSpacing: '-0.02em',
      }}>
        {career.title}
      </div>

      <div style={{
        fontFamily: 'DM Sans', fontSize: '0.82rem',
        color: 'rgba(255,255,255,0.38)', marginBottom: 18, lineHeight: 1.6,
      }}>
        {career.description}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>Difficulty</span>
          <span style={{
            padding: '2px 10px', borderRadius: 99, fontSize: '0.72rem',
            fontFamily: 'Space Grotesk', fontWeight: 600,
            background: `${diffColor[career.difficulty] || '#888'}18`,
            border: `1px solid ${diffColor[career.difficulty] || '#888'}35`,
            color: diffColor[career.difficulty] || '#888',
          }}>
            {career.difficulty}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>Math Intensity</span>
          <span style={{
            padding: '2px 10px', borderRadius: 99, fontSize: '0.72rem',
            fontFamily: 'Space Grotesk', fontWeight: 600,
            background: `${mathColor[career.mathIntensity] || '#888'}18`,
            border: `1px solid ${mathColor[career.mathIntensity] || '#888'}35`,
            color: mathColor[career.mathIntensity] || '#888',
          }}>
            {career.mathIntensity}
          </span>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>Starting Salary</span>
          <span style={{
            fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.9rem',
            background: `linear-gradient(135deg, ${career.color}, #A78BFA)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {career.salary}
          </span>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '14px 0 12px' }} />

          {/* Find Jobs button */}
          <a
            href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(career.title)}`}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '9px 16px', borderRadius: 10, textDecoration: 'none',
              background: 'rgba(10,102,194,0.12)',
              border: '1px solid rgba(10,102,194,0.25)',
              fontFamily: 'Space Grotesk', fontSize: '0.8rem', fontWeight: 600,
              color: '#5B9BD5', transition: 'all 0.2s ease',
              position: 'relative', zIndex: 3,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(10,102,194,0.22)'
              e.currentTarget.style.borderColor = 'rgba(10,102,194,0.45)'
              e.currentTarget.style.color = '#7BB3E0'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(10,102,194,0.12)'
              e.currentTarget.style.borderColor = 'rgba(10,102,194,0.25)'
              e.currentTarget.style.color = '#5B9BD5'
            }}
          >
            View jobs
          </a>
        </div>

      </div>
    </div >
  )
}
