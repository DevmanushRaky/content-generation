import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Rocket, CheckCircle2, Clock, Calendar,
  Send, Globe, Copy, Check, Zap,
} from 'lucide-react'
import { usePublisher } from '@/hooks/usePublisher'
import DashboardRouteTabs from '@/components/layout/DashboardRouteTabs'

// ─── Platform meta ────────────────────────────────────────────────────────────
const PM: Record<string, { label: string; color: string; bg: string; border: string }> = {
  tiktok:      { label: 'TikTok',     color: '#69C9D0', bg: 'rgba(105,201,208,0.08)', border: 'rgba(105,201,208,0.25)' },
  instagram:   { label: 'Instagram',  color: '#E1306C', bg: 'rgba(225,48,108,0.08)',  border: 'rgba(225,48,108,0.22)' },
  youtube:     { label: 'YouTube',    color: '#FF0000', bg: 'rgba(255,0,0,0.08)',      border: 'rgba(255,0,0,0.22)' },
  twitter_ads: { label: 'X Ads',      color: '#1d9bf0', bg: 'rgba(29,155,240,0.08)',  border: 'rgba(29,155,240,0.25)' },
  twitter:     { label: 'Twitter/X',  color: '#1d9bf0', bg: 'rgba(29,155,240,0.08)',  border: 'rgba(29,155,240,0.25)' },
  custom:      { label: 'Custom',     color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.25)' },
}
function getPM(p: string) { return PM[p] || PM.custom }

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  pending:   { label: 'Pending',   color: 'var(--text-muted)', bg: 'var(--bg-elevated)',      border: 'var(--border)',               icon: <Clock size={11}/> },
  scheduled: { label: 'Scheduled', color: '#fbbf24',           bg: 'rgba(251,191,36,0.1)',    border: 'rgba(251,191,36,0.3)',        icon: <Calendar size={11}/> },
  published: { label: 'Published', color: '#22c55e',           bg: 'rgba(34,197,94,0.1)',     border: 'rgba(34,197,94,0.3)',         icon: <CheckCircle2 size={11}/> },
}

function fmtDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      title="Copy"
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '4px 10px', borderRadius: 7, cursor: 'pointer',
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        color: copied ? '#22c55e' : 'var(--text-muted)', fontSize: 11, fontWeight: 600,
        transition: 'all 0.15s',
      }}
    >
      {copied ? <Check size={11}/> : <Copy size={11}/>}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PublisherIdeaPage({ onMenuOpen, isMobile }: { onMenuOpen: () => void; isMobile: boolean }) {
  const { ideaId } = useParams<{ ideaId: string }>()
  const navigate   = useNavigate()
  const { entries, scheduleEntry, publishNow } = usePublisher()
  const entry = entries.find(e => e.ideaId === ideaId) ?? null

  // Scheduling state
  const [schedDate, setSchedDate] = useState('')
  const [schedTime, setSchedTime] = useState('')
  const [activeCap, setActiveCap] = useState(0)

  if (!entry) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <PageHeader onBack={() => navigate('/publisher')} isMobile={isMobile} onMenuOpen={onMenuOpen} title="Not Found" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
          <Rocket size={32} style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Publisher entry not found.</p>
          <button onClick={() => navigate('/publisher')} style={{ padding: '8px 18px', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>
            Back to Publisher
          </button>
        </div>
      </div>
    )
  }

  const pm  = getPM(entry.platform)
  const sc  = STATUS_CFG[entry.publishStatus]
  const isPublished = entry.publishStatus === 'published'
  const bestTime = entry.bestTimes[0]

  function handleSchedule() {
    if (!schedDate || !schedTime) return
    const iso = new Date(`${schedDate}T${schedTime}`).toISOString()
    scheduleEntry(entry.ideaId, iso)
  }

  function handlePublishNow() {
    publishNow(entry.ideaId)
  }

  // Prefill date/time from scheduled
  const displayScheduled = entry.scheduledAt ? new Date(entry.scheduledAt) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <PageHeader onBack={() => navigate('/publisher')} isMobile={isMobile} onMenuOpen={onMenuOpen} title={entry.title} statusBadge={sc} />

      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          padding: isMobile ? '20px 16px' : '28px 32px',
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>

          {/* ── Idea info card ── */}
          <div style={{ padding: '18px 20px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(135deg, ${pm.color}33 0%, var(--bg-elevated) 100%)`,
                border: `1px solid ${pm.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>🚀</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px', lineHeight: 1.3 }}>
                  {entry.title}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 7, background: pm.bg, border: `1px solid ${pm.border}`, fontSize: 12, fontWeight: 600, color: pm.color }}>
                    {pm.label}
                  </span>
                  <span style={{ padding: '3px 9px', borderRadius: 7, background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
                    {entry.contentType === 'video' ? '🎬 Video' : '🖼 Image'}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 7, background: sc.bg, border: `1px solid ${sc.border}`, fontSize: 11, fontWeight: 700, color: sc.color }}>
                    {sc.icon} {sc.label}
                  </span>
                  {entry.model && (
                    <span style={{ padding: '3px 9px', borderRadius: 7, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', fontSize: 11, color: '#34d399' }}>
                      {entry.model}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isPublished && entry.publishedAt && (
              <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: '#22c55e', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>
                  Published on {fmtDate(entry.publishedAt)}
                </span>
              </div>
            )}
            {entry.publishStatus === 'scheduled' && entry.scheduledAt && (
              <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={15} style={{ color: '#fbbf24', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 600 }}>
                  Scheduled for {fmtDate(entry.scheduledAt)}
                </span>
              </div>
            )}
          </div>

          {/* ── Captions ── */}
          <Section icon="✍️" title="AI-Generated Captions" subtitle={`Optimised for ${pm.label}`}>
            {/* Tab pills */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {entry.captions.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCap(i)}
                  style={{
                    padding: '5px 14px', borderRadius: 99, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    border: activeCap === i ? `1px solid ${pm.color}` : '1px solid var(--border)',
                    background: activeCap === i ? pm.bg : 'var(--bg-elevated)',
                    color: activeCap === i ? pm.color : 'var(--text-muted)',
                    transition: 'all 0.15s',
                  }}
                >
                  Variant {i + 1}
                </button>
              ))}
            </div>

            {entry.captions[activeCap] && (
              <div style={{ padding: '16px', borderRadius: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                  <CopyBtn text={entry.captions[activeCap].caption + '\n\n' + entry.captions[activeCap].hashtags.join(' ')} />
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: '0 0 12px', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                  {entry.captions[activeCap].caption}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {entry.captions[activeCap].hashtags.map((h, hi) => (
                    <span key={hi} style={{ padding: '2px 9px', borderRadius: 6, background: pm.bg, border: `1px solid ${pm.border}`, fontSize: 11, fontWeight: 600, color: pm.color }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* ── Best times ── */}
          <Section icon="⏰" title="Best Time to Post" subtitle="AI-recommended windows based on platform engagement data">
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 14 }}>
              {entry.bestTimes.map((slot, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (isPublished) return
                    // Prefill scheduler with this time — find next occurrence of day
                    const dayMap: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 }
                    const targetDay = dayMap[slot.day] ?? 0
                    const now = new Date()
                    let d = new Date(now)
                    d.setDate(now.getDate() + ((targetDay - now.getDay() + 7) % 7 || 7))
                    setSchedDate(d.toISOString().split('T')[0])
                    // parse time string "7:00 PM" -> 24h
                    const [timePart, ampm] = slot.time.split(' ')
                    let [h, m] = timePart.split(':').map(Number)
                    if (ampm === 'PM' && h !== 12) h += 12
                    if (ampm === 'AM' && h === 12) h = 0
                    setSchedTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
                  }}
                  style={{
                    padding: '16px', borderRadius: 12,
                    background: i === 0 ? 'rgba(251,191,36,0.06)' : 'var(--bg-card)',
                    border: i === 0 ? '1px solid rgba(251,191,36,0.3)' : '1px solid var(--border)',
                    cursor: isPublished ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isPublished) e.currentTarget.style.borderColor = pm.color }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = i === 0 ? 'rgba(251,191,36,0.3)' : 'var(--border)' }}
                >
                  {i === 0 && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 6, background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.35)', fontSize: 10, fontWeight: 700, color: '#fbbf24', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      <Zap size={9}/> {slot.label}
                    </div>
                  )}
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                    {slot.day}
                  </p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: i === 0 ? '#fbbf24' : pm.color, margin: '0 0 8px' }}>
                    {slot.time}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                    {slot.reason}
                  </p>
                  {!isPublished && (
                    <p style={{ fontSize: 10, color: pm.color, margin: '8px 0 0', fontWeight: 600 }}>
                      Click to use this time →
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* ── Scheduler / Publish controls (only if not published) ── */}
          {!isPublished && (
            <Section icon="📅" title="Schedule or Publish" subtitle="Pick a date & time or go live right now">
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={schedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setSchedDate(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={schedTime}
                    onChange={e => setSchedTime(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {schedDate && schedTime && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.25)', marginBottom: 16, fontSize: 13, color: '#fbbf24', fontWeight: 500 }}>
                  <Calendar size={13} style={{ display: 'inline', marginRight: 6 }} />
                  Will be scheduled for {new Date(`${schedDate}T${schedTime}`).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={handleSchedule}
                  disabled={!schedDate || !schedTime}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '11px 22px', borderRadius: 11, cursor: (!schedDate || !schedTime) ? 'not-allowed' : 'pointer',
                    background: (!schedDate || !schedTime) ? 'var(--bg-elevated)' : 'rgba(251,191,36,0.12)',
                    border: `1px solid ${(!schedDate || !schedTime) ? 'var(--border)' : 'rgba(251,191,36,0.4)'}`,
                    color: (!schedDate || !schedTime) ? 'var(--text-muted)' : '#fbbf24',
                    fontSize: 14, fontWeight: 700, transition: 'all 0.15s',
                    opacity: (!schedDate || !schedTime) ? 0.6 : 1,
                  }}
                >
                  <Calendar size={15}/>
                  Schedule
                </button>

                <button
                  onClick={handlePublishNow}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '11px 22px', borderRadius: 11, cursor: 'pointer',
                    background: 'linear-gradient(135deg, var(--nova-color) 0%, #f59e0b 100%)',
                    border: 'none', color: '#000',
                    fontSize: 14, fontWeight: 700, transition: 'opacity 0.15s',
                    boxShadow: '0 4px 20px rgba(251,191,36,0.3)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <Send size={15}/>
                  Publish Now
                </button>
              </div>
            </Section>
          )}

          {/* ── Published read-only info ── */}
          {isPublished && (
            <div style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Globe size={20} style={{ color: '#22c55e' }}/>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#22c55e', margin: '0 0 3px' }}>Content Published</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                  This piece was published on {fmtDate(entry.publishedAt)} and is now live.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 13px', borderRadius: 9,
  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', fontSize: 14,
  outline: 'none', boxSizing: 'border-box',
  colorScheme: 'dark',
}

function Section({ icon, title, subtitle, children }: { icon: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '20px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</p>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 18px' }}>{subtitle}</p>
      {children}
    </div>
  )
}

function PageHeader({ onBack, isMobile, onMenuOpen, title, statusBadge }: {
  onBack: () => void; isMobile: boolean; onMenuOpen: () => void
  title: string; statusBadge?: typeof STATUS_CFG[keyof typeof STATUS_CFG]
}) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center',
      padding: '0 20px', height: 64, minHeight: 64,
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      flexShrink: 0, gap: 14, zIndex: 20,
    }}>
      {isMobile && (
        <button onClick={onMenuOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      )}

      <button
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, padding: '6px 4px', borderRadius: 8, transition: 'color 0.15s', flexShrink: 0 }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={15}/>
        {!isMobile && 'Publisher'}
      </button>

      <div style={{ width: 1, height: 22, background: 'var(--border)' }}/>

      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </p>
        {!isMobile && <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>Publisher · Idea detail</p>}
      </div>

      <DashboardRouteTabs isMobile={isMobile}/>

      {statusBadge && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 99, background: statusBadge.bg, border: `1px solid ${statusBadge.border}`, fontSize: 11, fontWeight: 600, color: statusBadge.color, flexShrink: 0 }}>
          {statusBadge.icon} {statusBadge.label}
        </div>
      )}
    </header>
  )
}
