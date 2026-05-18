import { useNavigate } from 'react-router-dom'
import { Menu, Rocket, Clock, Calendar, CheckCircle2, ChevronRight, Play, Image } from 'lucide-react'
import DashboardRouteTabs from '@/components/layout/DashboardRouteTabs'
import { DASHBOARD_ROUTES } from '@/components/layout/dashboardRoutes'
import { usePublisher, PublishStatus } from '@/hooks/usePublisher'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PM: Record<string, { label: string; color: string; bg: string; border: string }> = {
  tiktok:      { label: 'TikTok',    color: '#69C9D0', bg: 'rgba(105,201,208,0.08)', border: 'rgba(105,201,208,0.25)' },
  instagram:   { label: 'Instagram', color: '#E1306C', bg: 'rgba(225,48,108,0.08)',  border: 'rgba(225,48,108,0.22)' },
  youtube:     { label: 'YouTube',   color: '#FF0000', bg: 'rgba(255,0,0,0.08)',      border: 'rgba(255,0,0,0.22)' },
  twitter_ads: { label: 'X Ads',     color: '#1d9bf0', bg: 'rgba(29,155,240,0.08)',  border: 'rgba(29,155,240,0.25)' },
  twitter:     { label: 'Twitter/X', color: '#1d9bf0', bg: 'rgba(29,155,240,0.08)',  border: 'rgba(29,155,240,0.25)' },
  custom:      { label: 'Custom',    color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.25)' },
}
function getPM(p: string) { return PM[p] || PM.custom }

const STATUS_CFG: Record<PublishStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  pending:   { label: 'Pending',   color: 'var(--text-muted)', bg: 'var(--bg-elevated)',   border: 'var(--border)',               icon: <Clock size={11}/> },
  scheduled: { label: 'Scheduled', color: '#fbbf24',           bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)',        icon: <Calendar size={11}/> },
  published: { label: 'Published', color: '#22c55e',           bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)',         icon: <CheckCircle2 size={11}/> },
}

function fmtDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtScheduled(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div style={{
      padding: '14px 18px', borderRadius: 12,
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{value}</p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>{label}</p>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onGoCreator }: { onGoCreator: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40 }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--nova-subtle)', border: '1px solid rgba(251,191,36,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Rocket size={30} style={{ color: 'var(--nova-color)' }}/>
      </div>
      <div style={{ textAlign: 'center', maxWidth: 340 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>No videos queued yet</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          Go to Creator, open a completed job, and click "Publish" to send it here.
        </p>
      </div>
      <button
        onClick={onGoCreator}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 11,
          background: 'linear-gradient(135deg, var(--nova-color) 0%, #f59e0b 100%)',
          border: 'none', color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(251,191,36,0.25)', transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Go to Creator <ChevronRight size={14}/>
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PublisherDashboardPage({ onMenuOpen, isMobile }: { onMenuOpen: () => void; isMobile: boolean }) {
  const navigate = useNavigate()
  const { entries } = usePublisher()
  const publisherRoute = DASHBOARD_ROUTES.find(r => r.id === 'publisher')

  const total     = entries.length
  const pending   = entries.filter(e => e.publishStatus === 'pending').length
  const scheduled = entries.filter(e => e.publishStatus === 'scheduled').length
  const published = entries.filter(e => e.publishStatus === 'published').length

  const COLS = ['#', 'Title', 'Platform', 'Type', 'Status', 'Scheduled', 'Published', '']

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
          <button onClick={onMenuOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Menu size={20}/>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--nova-color) 0%, #f59e0b 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, boxShadow: '0 0 18px rgba(251,191,36,0.28)',
          }}>
            <Rocket size={17} style={{ color: '#000' }}/>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Publisher</p>
          </div>
        </div>

        <DashboardRouteTabs isMobile={isMobile}/>

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--nova-color)', fontWeight: 600 }}>{publisherRoute?.label ?? 'Publisher'}</span>
            <span>·</span>
            <span>{publisherRoute?.tagline ?? 'Schedule and distribute your content'}</span>
          </div>
        )}

        <div style={{ flex: 1 }}/>

        {published > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 99, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', fontSize: 11, fontWeight: 600, color: '#22c55e', flexShrink: 0 }}>
            <CheckCircle2 size={11}/> {published} Published
          </div>
        )}
      </header>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-primary)' }}>
        {entries.length === 0 ? (
          <EmptyState onGoCreator={() => navigate('/creator')}/>
        ) : (
          <>
            {/* Stats strip */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: 12 }}>
                <StatCard label="Total"     value={total}     color="#a78bfa" icon={<Rocket size={17}/>}/>
                <StatCard label="Pending"   value={pending}   color="var(--text-muted)" icon={<Clock size={17}/>}/>
                <StatCard label="Scheduled" value={scheduled} color="#fbbf24" icon={<Calendar size={17}/>}/>
                <StatCard label="Published" value={published} color="#22c55e" icon={<CheckCircle2 size={17}/>}/>
              </div>
            </div>

            {/* Table */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, color: 'var(--text-primary)', minWidth: 760 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 2 }}>
                    {COLS.map((col, i) => (
                      <th key={i} style={{
                        padding: i === 0 ? '11px 16px 11px 24px' : i === COLS.length - 1 ? '11px 20px 11px 8px' : '11px 14px',
                        textAlign: 'left', fontSize: 11, fontWeight: 600,
                        letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap',
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => {
                    const pm = getPM(entry.platform)
                    const sc = STATUS_CFG[entry.publishStatus]
                    const isVideo = entry.contentType === 'video'

                    return (
                      <tr
                        key={entry.id}
                        onClick={() => navigate(`/publisher/${entry.ideaId}`)}
                        style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {/* # */}
                        <td style={{ padding: '13px 16px 13px 24px', width: 40 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--nova-color)', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 5, padding: '2px 6px' }}>
                            {idx + 1}
                          </span>
                        </td>

                        {/* Title */}
                        <td style={{ padding: '13px 14px', maxWidth: 260 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                              background: entry.publishStatus === 'published' ? `linear-gradient(135deg, ${pm.color}44 0%, var(--bg-elevated) 100%)` : 'var(--bg-elevated)',
                              border: `1px solid ${entry.publishStatus === 'published' ? pm.border : 'var(--border)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
                            }}>
                              {isVideo ? <Play size={13}/> : <Image size={13}/>}
                            </div>
                            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                              {entry.title}
                            </p>
                          </div>
                        </td>

                        {/* Platform */}
                        <td style={{ padding: '13px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 7, background: pm.bg, border: `1px solid ${pm.border}`, fontSize: 12, fontWeight: 600, color: pm.color }}>
                            {pm.label}
                          </span>
                        </td>

                        {/* Type */}
                        <td style={{ padding: '13px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 7, background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
                            {isVideo ? <Play size={10} style={{ color: 'var(--nova-color)' }}/> : <span style={{ fontSize: 10 }}>🖼</span>}
                            {isVideo ? 'Video' : 'Image'}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '13px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                            {sc.icon} {sc.label}
                          </span>
                        </td>

                        {/* Scheduled At */}
                        <td style={{ padding: '13px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: 12, color: entry.scheduledAt ? '#fbbf24' : 'var(--text-muted)' }}>
                            {fmtScheduled(entry.scheduledAt)}
                          </span>
                        </td>

                        {/* Published At */}
                        <td style={{ padding: '13px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: 12, color: entry.publishedAt ? '#22c55e' : 'var(--text-muted)' }}>
                            {fmtDate(entry.publishedAt)}
                          </span>
                        </td>

                        {/* Arrow */}
                        <td style={{ padding: '13px 20px 13px 8px', textAlign: 'right' }}>
                          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }}/>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
