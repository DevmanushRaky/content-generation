import IdeasBoard from '@/components/dashboard/IdeasBoard'
import { useIdeas } from '@/hooks/useIdeas'
import { useNavigate } from 'react-router-dom'
import { Menu, ArrowLeft, RotateCcw } from 'lucide-react'

export default function GenerateIdeasPage({ onMenuOpen, isMobile }) {
  const { latestIdeas, latestBatchMeta, approveIdea, rejectIdea } = useIdeas()
  const navigate = useNavigate()

  // work with the latest batch only
  const ideas = latestIdeas
  const topicTitle = formatTopicTitle(latestBatchMeta?.topic)
  const hashtagLine = formatHashtagLine(latestBatchMeta?.hashtags)

  function handleNewResearch() {
    navigate('/researcher?view=scrape')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <header style={{
        display: 'flex', alignItems: 'center',
        padding: '0 20px', height: 64, minHeight: 64,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        flexShrink: 0, gap: 14, zIndex: 20,
      }}>
        {isMobile && (
          <button
            onClick={onMenuOpen}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', padding: 6, borderRadius: 8,
              display: 'flex', alignItems: 'center', flexShrink: 0,
            }}
          >
            <Menu size={20} />
          </button>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate('/researcher')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 13, fontWeight: 500,
            padding: '6px 4px', borderRadius: 8, transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
          <ArrowLeft size={15} />
          {!isMobile && 'Researcher'}
        </button>

        <div style={{ width: 1, height: 22, background: 'var(--border)' }} />

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontSize: 18 }}>🔮</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {topicTitle}
            </p>
            {!isMobile && (
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
                {hashtagLine || "Researcher's results — approve the ideas you want to move forward with"}
              </p>
            )}
          </div>
        </div>
        <div style={{ flex: 1 }} />

        {/* New Research button in header */}
        <button
          id="new-research-header-btn"
          onClick={handleNewResearch}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '7px 13px', borderRadius: 9,
            border: '1px solid var(--border)', background: 'var(--bg-elevated)',
            color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.15s', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          <RotateCcw size={12} />
          New Research
        </button>

      </header>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', minHeight: 0 }}>
        {ideas.length === 0 ? (
          <EmptyState onGenerate={() => navigate('/researcher')} />
        ) : (
          <IdeasBoard
            ideas={ideas}
            onApprove={approveIdea}
            onReject={rejectIdea}
            onNewResearch={handleNewResearch}
          />
        )}
      </div>
    </div>
  )
}

function EmptyState({ onGenerate }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20, fontSize: 36,
        background: 'var(--soul-subtle)', border: '1px solid var(--accent-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>🔮</div>
      <div style={{ textAlign: 'center', maxWidth: 340 }}>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
          No ideas yet
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          Run a research job from the Dashboard and Researcher will surface trending ideas here.
        </p>
      </div>
      <button
        onClick={onGenerate}
        style={{
          padding: '11px 22px', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Start Research
      </button>
    </div>
  )
}

function formatTopicTitle(topic) {
  const cleaned = (topic || '').trim()
  if (!cleaned) return 'Generated Ideas'
  const words = cleaned.split(/\s+/).filter(Boolean)
  if (words.length <= 7) return cleaned
  return `${words.slice(0, 7).join(' ')}…`
}

function formatHashtagLine(hashtags) {
  if (!Array.isArray(hashtags) || hashtags.length === 0) return ''
  return hashtags.map(tag => `#${String(tag).replace(/^#/, '')}`).join(' ')
}
