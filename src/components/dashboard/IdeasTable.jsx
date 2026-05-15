import { useNavigate } from 'react-router-dom'
import { Heart, Eye, Clock, ArrowRight, Play } from 'lucide-react'

// Inline SVG brand icons — real platform logos
function InstagramIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497"/>
          <stop offset="5%" stopColor="#fdf497"/>
          <stop offset="45%" stopColor="#fd5949"/>
          <stop offset="60%" stopColor="#d6249f"/>
          <stop offset="90%" stopColor="#285AEB"/>
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-grad)"/>
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2" fill="none"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
    </svg>
  )
}
function TikTokIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.01a8.16 8.16 0 0 0 4.78 1.52V7.07a4.85 4.85 0 0 1-1.01-.38z"/>
    </svg>
  )
}
function YouTubeIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}
function TwitterXIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}
function MegaphoneIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l19-9-9 19-2-8-8-2z"/>
    </svg>
  )
}

const PLATFORM_META = {
  instagram:   { label: 'Instagram', Icon: InstagramIcon, color: '#E1306C', bg: 'rgba(225,48,108,0.08)', border: 'rgba(225,48,108,0.22)' },
  tiktok:      { label: 'TikTok',    Icon: TikTokIcon,    color: '#69C9D0', bg: 'rgba(105,201,208,0.08)', border: 'rgba(105,201,208,0.22)' },
  youtube:     { label: 'YouTube',   Icon: YouTubeIcon,   color: '#FF0000', bg: 'rgba(255,0,0,0.08)',     border: 'rgba(255,0,0,0.22)' },
  pinterest:   { label: 'Pinterest', Icon: () => <span style={{ fontSize: 11 }}>📌</span>, color: '#E60023', bg: 'rgba(230,0,35,0.08)', border: 'rgba(230,0,35,0.22)' },
  reddit:      { label: 'Reddit',    Icon: () => <span style={{ fontSize: 11 }}>🔴</span>, color: '#FF6314', bg: 'rgba(255,99,20,0.08)', border: 'rgba(255,99,20,0.22)' },
  twitter:     { label: 'Twitter/X', Icon: TwitterXIcon,  color: '#1DA1F2', bg: 'rgba(29,161,242,0.08)', border: 'rgba(29,161,242,0.22)' },
  twitter_ads: { label: 'Twitter Ads', Icon: MegaphoneIcon, color: '#1DA1F2', bg: 'rgba(29,161,242,0.08)', border: 'rgba(29,161,242,0.22)' },
}


const STATUS_CONFIG = {
  pending:  { label: 'Pending',  color: 'var(--text-muted)', bg: 'var(--bg-elevated)',  border: 'var(--border)' },
  approved: { label: 'Approved', color: '#22c55e',           bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.28)' },
  rejected: { label: 'Rejected', color: '#ef4444',           bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
}

const STAGE_META = {
  soul:      { label: 'Soul',      icon: '🔮', color: 'var(--soul-color)', bg: 'var(--soul-subtle)', border: 'var(--accent-border)' },
  max:       { label: 'Max',       icon: '✍️',  color: 'var(--max-color)',  bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
  nova:      { label: 'Nova',      icon: '🚀', color: 'var(--nova-color)', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
  published: { label: 'Published', icon: '✅', color: '#22c55e',           bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.28)' },
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1)   return 'Just now'
  if (diffMins < 60)  return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7)   return `${diffDays}d ago`
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function IdeasTable({ ideas, onNewResearch }) {
  const navigate = useNavigate()

  if (ideas.length === 0) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
        background: 'var(--bg-primary)',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, fontSize: 34,
          background: 'var(--soul-subtle)', border: '1px solid var(--accent-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>🔮</div>
        <div style={{ textAlign: 'center', maxWidth: 340 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
            No ideas yet
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
            Click "New Research" to let Soul discover trending content ideas for you.
          </p>
        </div>
        <button
          onClick={onNewResearch}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '11px 22px', borderRadius: 12, border: 'none',
            background: 'var(--accent)', color: '#fff',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Start Research <ArrowRight size={15} />
        </button>
      </div>
    )
  }


  const COLS = ['#', 'Topic', 'Platform', 'Type', 'Engagement', 'Generated', 'Stage', 'Status']

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-primary)' }}>

      {/* ── Heading bar ── */}
      <div style={{
        padding: '10px 28px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        display: 'flex', alignItems: 'center', gap: 12,
        flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Ideas Board
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
            Your approved and pending content ideas
          </p>
        </div>
        <button
          onClick={onNewResearch}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 13px', borderRadius: 9,
            border: '1px solid var(--accent-border)',
            background: 'var(--accent-subtle)',
            color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            transition: 'opacity 0.15s',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          New Research
        </button>
      </div>

      {/* ── Table ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          fontSize: 13, color: 'var(--text-primary)', minWidth: 860,
        }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              position: 'sticky', top: 0, zIndex: 2,
            }}>
              {COLS.map((col, i) => (
                <th key={i} style={{
                  padding: i === 0 ? '11px 16px 11px 28px' : '11px 14px',
                  textAlign: 'left',
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
                  textTransform: 'uppercase', color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ideas.map((idea, idx) => {
              const pm = PLATFORM_META[idea.platform] || PLATFORM_META.instagram
              const st = STATUS_CONFIG[idea.status]  || STATUS_CONFIG.pending
              const sm = STAGE_META[idea.stage]       || STAGE_META.soul
              const isVideo = idea.contentType === 'video'

              return (
                <tr
                  key={idea.id}
                  style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background 0.1s' }}
                  onClick={() => navigate('/generate-ideas')}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* # */}
                  <td style={{ padding: '13px 16px 13px 28px', width: 40 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: 'var(--accent)',
                      background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
                      borderRadius: 5, padding: '2px 6px',
                    }}>
                      {idea.rank ?? idx + 1}
                    </span>
                  </td>

                  {/* Topic */}
                  <td style={{ padding: '13px 14px', maxWidth: 240 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                      {idea.topicHeading || idea.title || '—'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                      {idea.topic}
                    </p>
                  </td>

                  {/* Platform */}
                  <td style={{ padding: '13px 14px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 9px', borderRadius: 7,
                      background: pm.bg, border: `1px solid ${pm.border}`,
                      fontSize: 12, fontWeight: 600, color: pm.color,
                    }}>
                      <pm.Icon size={12} />
                      {pm.label}
                    </span>
                  </td>

                  {/* Type */}
                  <td style={{ padding: '13px 14px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 9px', borderRadius: 7,
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                      fontSize: 12, color: 'var(--text-muted)',
                    }}>
                      {isVideo ? <Play size={10} style={{ color: 'var(--accent)' }} /> : <span style={{ fontSize: 10 }}>🖼</span>}
                      {isVideo ? 'Video' : 'Image'}
                    </span>
                  </td>

                  {/* Engagement */}
                  <td style={{ padding: '13px 14px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f43f5e', fontSize: 12 }}>
                        <Heart size={11} /><span style={{ fontWeight: 600 }}>{idea.likesFormatted ?? '—'}</span>
                      </span>
                      {isVideo && idea.viewsFormatted && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12 }}>
                          <Eye size={11} /><span>{idea.viewsFormatted}</span>
                        </span>
                      )}
                      {isVideo && idea.duration && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12 }}>
                          <Clock size={11} /><span>{idea.duration}</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Generated At */}
                  <td style={{ padding: '13px 14px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {formatDate(idea.generatedAt)}
                    </span>
                  </td>

                  {/* Stage */}
                  <td style={{ padding: '13px 14px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 9px', borderRadius: 7,
                      background: sm.bg, border: `1px solid ${sm.border}`,
                      fontSize: 12, fontWeight: 600, color: sm.color,
                    }}>
                      <span style={{ fontSize: 12 }}>{sm.icon}</span>
                      {sm.label}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '13px 14px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px', borderRadius: 7,
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                      background: st.bg, color: st.color, border: `1px solid ${st.border}`,
                    }}>
                      {st.label}
                    </span>
                  </td>

                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
