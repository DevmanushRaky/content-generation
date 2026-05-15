const STEPS = [
  'Scanning trending hashtags across platforms…',
  'Filtering by engagement signals…',
  'Ranking ideas by trend score…',
  'Generating content hooks…',
  'Packaging results for you…',
]

export default function ProcessingLoader() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40,
      padding: '40px 24px',
      background: 'var(--bg-primary)',
    }}>

      {/* Animated Soul orb */}
      <div style={{ position: 'relative', width: 96, height: 96 }}>
        {/* Outer pulse ring */}
        <div style={{
          position: 'absolute', inset: -12,
          borderRadius: '50%',
          border: '2px solid var(--accent-border)',
          animation: 'soul-pulse 2s ease-in-out infinite',
        }} />
        {/* Mid ring */}
        <div style={{
          position: 'absolute', inset: -4,
          borderRadius: '50%',
          border: '1.5px solid var(--accent-border)',
          opacity: 0.5,
          animation: 'soul-pulse 2s ease-in-out infinite 0.4s',
        }} />
        {/* Core */}
        <div style={{
          width: '100%', height: '100%',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
          boxShadow: '0 0 48px rgba(124,106,247,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'soul-spin 3s linear infinite',
        }}>
          <div style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            opacity: 0.95,
          }} />
        </div>
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <h2 style={{
          fontSize: 22, fontWeight: 700,
          color: 'var(--text-primary)', margin: '0 0 10px',
          letterSpacing: '-0.02em',
        }}>
          Soul is working…
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          Scanning social platforms, analysing engagement patterns, and curating the best ideas for your topic.
        </p>
      </div>

      {/* Animated steps */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 12,
        width: '100%', maxWidth: 380,
      }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            animation: `step-fade-in 0.4s ease both`,
            animationDelay: `${i * 0.6}s`,
            opacity: 0,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: 'var(--accent)',
              animation: `step-dot ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.6}s`,
            }} />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{step}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes soul-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.12); opacity: 1; }
        }
        @keyframes soul-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes step-fade-in {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes step-dot {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  )
}
