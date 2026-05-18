import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, Heart, Eye, Clock, ExternalLink, Copy, Check, Play, Image, MessageCircle } from 'lucide-react'
import { PLATFORM_META } from './platforms'

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  bg: 'var(--bg-elevated)',        border: 'var(--border)',              color: 'var(--text-muted)',  cardBorder: 'var(--border)' },
  approved: { label: 'Approved', bg: 'rgba(34,197,94,0.1)',       border: 'rgba(34,197,94,0.3)',        color: '#22c55e',            cardBorder: 'rgba(34,197,94,0.4)' },
  rejected: { label: 'Rejected', bg: 'rgba(239,68,68,0.08)',      border: 'rgba(239,68,68,0.25)',       color: '#ef4444',            cardBorder: 'rgba(239,68,68,0.3)' },
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function handleCopy(e) {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button
      onClick={handleCopy}
      title="Copy URL"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', cursor: 'pointer',
        color: copied ? '#22c55e' : 'var(--text-muted)',
        padding: 4, borderRadius: 6, flexShrink: 0,
        transition: 'color 0.15s',
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  )
}

function IdeaCard({ idea, onApprove, onReject }) {
  const navigate = useNavigate()
  const st   = STATUS_CONFIG[idea.status]
  const pm   = PLATFORM_META[idea.platform] || PLATFORM_META.instagram
  const isVideo = idea.contentType === 'video'

  function handleApprove() {
    onApprove(idea.id)
    // Small delay so the status update is visible before navigation
    setTimeout(() => navigate('/creator'), 400)
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1.5px solid ${st.cardBorder}`,
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: 0,
      overflow: 'hidden',
      transition: 'box-shadow 0.2s, border-color 0.2s',
      animation: 'card-in 0.3s cubic-bezier(0.4,0,0.2,1) both',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.28)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        flex: 1,
        minHeight: 0,
      }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minHeight: 0 }}>
          {/* ── Row 1: rank + title + status + content type ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, flex: 1 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 6, flexShrink: 0,
                background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid var(--accent-border)',
              }}>#{idea.rank}</span>
              <h3 style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
                lineHeight: 1.35,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {idea.topicHeading}
              </h3>
            </div>
            <div style={{ display: 'flex', gap: 7, flexShrink: 0, alignItems: 'center' }}>
              {/* Content type badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '3px 9px', borderRadius: 7,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
              }}>
                {isVideo
                  ? <><Play size={10} style={{ color: 'var(--accent)' }} /><span>Video</span></>
                  : <><Image size={10} style={{ color: 'var(--nova-color)' }} /><span>Image</span></>}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                background: st.bg, color: st.color, border: `1px solid ${st.border}`,
              }}>
                {st.label.toUpperCase()}
              </span>
            </div>
          </div>

          {/* ── Row 2: Platform badge + stats floated right ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 11px', borderRadius: 8,
              background: pm.bg, border: `1px solid ${pm.border}`,
              fontSize: 12, fontWeight: 600, color: pm.color,
            }}>
              <pm.Icon size={14} style={{ flexShrink: 0 }} />
              {pm.label}
            </div>
            {/* Stats floated to the right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#f43f5e', fontWeight: 600 }}>
                <Heart size={11} />{idea.likesFormatted ?? '—'}
              </span>
              {isVideo && idea.viewsFormatted && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                  <Eye size={11} />{idea.viewsFormatted}
                </span>
              )}
              {isVideo && idea.duration && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                  <Clock size={11} />{idea.duration}
                </span>
              )}
            </div>
          </div>

          {/* ── Row 3: Source URL ── */}
          <div style={{
            display: 'flex', alignItems: 'center',
            padding: '7px 10px', borderRadius: 9,
            background: 'var(--bg-primary)', border: '1px solid var(--border)',
            gap: 6, overflow: 'hidden',
          }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontSize: 12, color: 'var(--text-muted)' }}>
              {idea.sourceUrl}
            </span>
            <CopyButton text={idea.sourceUrl} />
            <a
              href={idea.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open link"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', flexShrink: 0, padding: 4, borderRadius: 6,
                textDecoration: 'none', transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <ExternalLink size={13} />
            </a>
          </div>

          {/* ── Row 4: Why popular ── */}
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Why it's popular
          </p>
          <div style={{
            padding: '12px 14px', borderRadius: 10,
            background: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            flex: 1,
            minHeight: 80,
            maxHeight: 160,
            overflowY: 'auto',
            marginTop: -8,
          }}>
            <p style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.65,
            }}>
              {idea.whyPopular}
            </p>
          </div>
        </div>

        {/* ── Row 5: Approve / Reject / Chat ── */}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <button
            id={`approve-idea-${idea.id}`}
            onClick={handleApprove}
            disabled={idea.status === 'approved'}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '9px 0', borderRadius: 10,
              border: `1px solid ${idea.status === 'approved' ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.25)'}`,
              background: idea.status === 'approved' ? 'rgba(34,197,94,0.14)' : 'transparent',
              color: idea.status === 'approved' ? '#22c55e' : 'var(--text-secondary)',
              fontSize: 12, fontWeight: 600, cursor: idea.status === 'approved' ? 'default' : 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (idea.status !== 'approved') { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; e.currentTarget.style.color = '#22c55e' } }}
            onMouseLeave={e => { if (idea.status !== 'approved') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
          >
            <CheckCircle2 size={14} />
            {idea.status === 'approved' ? 'Approved ✓' : 'Approve → Creator'}
          </button>

          <button
            id={`reject-idea-${idea.id}`}
            onClick={() => onReject(idea.id)}
            disabled={idea.status === 'rejected'}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '9px 0', borderRadius: 10,
              border: `1px solid ${idea.status === 'rejected' ? 'rgba(239,68,68,0.35)' : 'rgba(239,68,68,0.2)'}`,
              background: idea.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'transparent',
              color: idea.status === 'rejected' ? '#ef4444' : 'var(--text-secondary)',
              fontSize: 12, fontWeight: 600, cursor: idea.status === 'rejected' ? 'default' : 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (idea.status !== 'rejected') { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444' } }}
            onMouseLeave={e => { if (idea.status !== 'rejected') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
          >
            <XCircle size={14} />
            {idea.status === 'rejected' ? 'Rejected' : 'Reject'}
          </button>

          {/* Chat button */}
          <button
            id={`chat-idea-${idea.id}`}
            title="Chat about this idea"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              padding: '9px 14px', borderRadius: 10,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-subtle)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
          >
            <MessageCircle size={14} />
            Chat
          </button>
        </div>
      </div>

      <style>{`
        @keyframes card-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default function IdeasBoard({ ideas, onApprove, onReject, onNewResearch: _onNewResearch }) {

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--bg-primary)' }}>

      {/* ── Cards Grid ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          alignItems: 'stretch',
          gap: 18,
          maxWidth: 1400,
        }}>
          {ideas.map((idea, i) => (
            <div key={idea.id} style={{ animationDelay: `${i * 0.06}s`, display: 'flex' }}>
              <IdeaCard idea={idea} onApprove={onApprove} onReject={onReject} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
