import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Wand2, Clock, CheckCircle2, AlertCircle, Loader2, ChevronRight, Play, Image } from 'lucide-react'
import { useIdeas } from '@/hooks/useIdeas'
import { useMax, MaxJob, MaxStatus } from '@/hooks/useMax'
import DashboardRouteTabs from '@/components/layout/DashboardRouteTabs'
import { DASHBOARD_ROUTES } from '@/components/layout/dashboardRoutes'

// ─── Status Config ────────────────────────────────────────────────────────────

type StatusConfig = {
  label: string
  color: string
  bg: string
  border: string
  icon: React.ReactNode
  animate?: boolean
}

function getStatusConfig(status: MaxStatus): StatusConfig {
  switch (status) {
    case 'queued':
      return {
        label: 'Queued',
        color: 'var(--text-muted)',
        bg: 'var(--bg-elevated)',
        border: 'var(--border)',
        icon: <Clock size={11} />,
      }
    case 'generating_prompt':
      return {
        label: 'Generating Prompt',
        color: '#60a5fa',
        bg: 'rgba(96,165,250,0.1)',
        border: 'rgba(96,165,250,0.3)',
        icon: <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} />,
        animate: true,
      }
    case 'prompt_ready':
      return {
        label: 'Prompt Ready',
        color: '#a78bfa',
        bg: 'rgba(167,139,250,0.1)',
        border: 'rgba(167,139,250,0.3)',
        icon: <CheckCircle2 size={11} />,
      }
    case 'selecting_model':
      return {
        label: 'Selecting Model',
        color: '#fbbf24',
        bg: 'rgba(251,191,36,0.1)',
        border: 'rgba(251,191,36,0.3)',
        icon: <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} />,
        animate: true,
      }
    case 'generating_video':
      return {
        label: 'Generating Video',
        color: 'var(--max-color)',
        bg: 'var(--max-subtle)',
        border: 'rgba(52,211,153,0.35)',
        icon: <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} />,
        animate: true,
      }
    case 'video_ready':
      return {
        label: 'Video Ready',
        color: 'var(--success)',
        bg: 'rgba(34,197,94,0.1)',
        border: 'rgba(34,197,94,0.3)',
        icon: <CheckCircle2 size={11} />,
      }
    case 'failed':
      return {
        label: 'Failed',
        color: 'var(--destructive)',
        bg: 'var(--destructive-subtle)',
        border: 'rgba(239,68,68,0.3)',
        icon: <AlertCircle size={11} />,
      }
    default:
      return {
        label: 'Unknown',
        color: 'var(--text-muted)',
        bg: 'var(--bg-elevated)',
        border: 'var(--border)',
        icon: <Clock size={11} />,
      }
  }
}

// ─── Platform badge ───────────────────────────────────────────────────────────

const PLATFORM_COLORS: Record<string, { color: string; bg: string; border: string; label: string }> = {
  tiktok:      { color: '#f0f0f0', bg: 'rgba(0,0,0,0.4)',          border: 'rgba(240,240,240,0.2)', label: 'TikTok' },
  instagram:   { color: '#e1306c', bg: 'rgba(225,48,108,0.1)',      border: 'rgba(225,48,108,0.3)', label: 'Instagram' },
  youtube:     { color: '#ff0000', bg: 'rgba(255,0,0,0.08)',        border: 'rgba(255,0,0,0.25)',   label: 'YouTube' },
  twitter_ads: { color: '#1d9bf0', bg: 'rgba(29,155,240,0.1)',      border: 'rgba(29,155,240,0.3)', label: 'X Ads' },
  twitter:     { color: '#1d9bf0', bg: 'rgba(29,155,240,0.1)',      border: 'rgba(29,155,240,0.3)', label: 'X / Twitter' },
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

const PROGRESS_MAP: Record<MaxStatus, number> = {
  queued:            8,
  generating_prompt: 28,
  prompt_ready:      45,
  selecting_model:   60,
  generating_video:  80,
  video_ready:       100,
  failed:            0,
}

function ProgressBar({ status }: { status: MaxStatus }) {
  const pct = PROGRESS_MAP[status] ?? 0
  const isActive = !['video_ready', 'failed', 'queued'].includes(status)
  const isFailed = status === 'failed'
  const isDone   = status === 'video_ready'

  const color = isFailed ? 'var(--destructive)' : isDone ? 'var(--success)' : 'var(--max-color)'

  return (
    <div style={{
      width: '100%', height: 3, borderRadius: 99,
      background: 'var(--bg-primary)',
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        borderRadius: 99,
        background: color,
        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: isActive ? `0 0 6px ${color}` : 'none',
      }} />
    </div>
  )
}

// ─── Job Row ──────────────────────────────────────────────────────────────────

function JobRow({ job, onClick }: { job: MaxJob; onClick: () => void }) {
  const sc = getStatusConfig(job.status)
  const pm = PLATFORM_COLORS[job.platform] || PLATFORM_COLORS.instagram
  const isVideo = job.contentType === 'video'
  const isDone  = job.status === 'video_ready'
  const isFailed = job.status === 'failed'

  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto',
        alignItems: 'center',
        gap: 16,
        padding: '14px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        transition: 'background 0.15s',
        background: 'transparent',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Left: icon + title + progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
        {/* Thumbnail / content type indicator */}
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: isDone
            ? `linear-gradient(135deg, ${job.thumbnailUrl || 'var(--max-color)'} 0%, rgba(0,0,0,0.4) 100%)`
            : 'var(--bg-elevated)',
          border: `1.5px solid ${isDone ? 'rgba(52,211,153,0.4)' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isDone ? '#fff' : 'var(--text-muted)',
        }}>
          {isVideo
            ? <Play size={14} fill={isDone ? '#fff' : 'none'} />
            : <Image size={14} />}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
            margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {job.title}
          </p>
          <ProgressBar status={job.status} />
        </div>
      </div>

      {/* Platform badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '3px 10px', borderRadius: 7,
        background: pm.bg, border: `1px solid ${pm.border}`,
        fontSize: 11, fontWeight: 600, color: pm.color,
        flexShrink: 0,
      }}>
        {pm.label}
      </div>

      {/* Status badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '4px 10px', borderRadius: 7,
        background: sc.bg, border: `1px solid ${sc.border}`,
        fontSize: 11, fontWeight: 600, color: sc.color,
        flexShrink: 0, whiteSpace: 'nowrap',
      }}>
        {sc.icon}
        {sc.label}
      </div>

      {/* Arrow */}
      <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onGoGenerate }: { onGoGenerate: () => void }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20, fontSize: 34,
        background: 'var(--max-subtle)', border: '1px solid rgba(52,211,153,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✍️</div>
      <div style={{ textAlign: 'center', maxWidth: 340 }}>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
          No approved ideas yet
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          Approve ideas from the Generate Ideas page and Creator will start producing content automatically.
        </p>
      </div>
      <button
        onClick={onGoGenerate}
        style={{
          padding: '11px 22px', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: 'var(--max-color)', color: '#000', fontSize: 14, fontWeight: 700,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Go to Generate Ideas
      </button>
    </div>
  )
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ jobs }: { jobs: MaxJob[] }) {
  const total   = jobs.length
  const done    = jobs.filter(j => j.status === 'video_ready').length
  const active  = jobs.filter(j => !['video_ready', 'failed', 'queued'].includes(j.status)).length
  const queued  = jobs.filter(j => j.status === 'queued').length
  const failed  = jobs.filter(j => j.status === 'failed').length

  const stat = (label: string, value: number, color: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '0 20px' }}>
      <span style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: '-0.04em' }}>{value}</span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
    </div>
  )

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '14px 24px', gap: 0,
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      flexShrink: 0,
    }}>
      {stat('Total', total, 'var(--text-primary)')}
      <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
      {stat('Ready', done, 'var(--success)')}
      <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
      {stat('In Progress', active, 'var(--max-color)')}
      <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
      {stat('Queued', queued, 'var(--text-muted)')}
      {failed > 0 && (
        <>
          <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
          {stat('Failed', failed, 'var(--destructive)')}
        </>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreatorDashboardPage({ onMenuOpen, isMobile }: { onMenuOpen: () => void; isMobile: boolean }) {
  const navigate = useNavigate()
  const { ideas } = useIdeas()
  const approvedIdeas = useMemo(() => ideas.filter(i => i.status === 'approved'), [ideas])
  const { jobs } = useMax(approvedIdeas)
  const creatorRoute = DASHBOARD_ROUTES.find(route => route.id === 'creator')

  function handleRowClick(job: MaxJob) {
    navigate(`/creator/${job.ideaId}`)
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

        {/* Creator icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--max-color) 0%, #059669 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, flexShrink: 0, boxShadow: '0 0 18px rgba(52,211,153,0.35)',
          }}>✍️</div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Creator
            </p>
          </div>
        </div>

        <DashboardRouteTabs isMobile={isMobile} />
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--max-color)', fontWeight: 600 }}>{creatorRoute?.label ?? 'Creator'}</span>
            <span>·</span>
            <span>{creatorRoute?.tagline ?? 'Content generation and production'}</span>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Live indicator */}
        {jobs.some(j => !['video_ready', 'failed'].includes(j.status)) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 99,
            background: 'var(--max-subtle)', border: '1px solid rgba(52,211,153,0.35)',
            fontSize: 11, fontWeight: 600, color: 'var(--max-color)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--max-color)',
              animation: 'pulse-dot 1.4s ease-in-out infinite',
              display: 'inline-block',
            }} />
            Processing
          </div>
        )}
      </header>

      {/* ── Stats ── */}
      {jobs.length > 0 && <StatsBar jobs={jobs} />}

      {/* ── List ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)' }}>
        {jobs.length === 0 ? (
          <EmptyState onGoGenerate={() => navigate('/generate-ideas')} />
        ) : (
          <>
            {/* Section header */}
            <div style={{
              padding: '12px 20px 8px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Wand2 size={13} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Approved Ideas — {jobs.length} job{jobs.length !== 1 ? 's' : ''}
              </span>
            </div>
            {jobs.map(job => (
              <JobRow key={job.id} job={job} onClick={() => handleRowClick(job)} />
            ))}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>
    </div>
  )
}
