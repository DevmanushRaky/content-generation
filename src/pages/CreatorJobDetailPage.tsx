import { useMemo, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize2,
  CheckCircle2, Loader2, Clock, AlertCircle, RefreshCw,
  Cpu, Wand2, Film, Zap,
} from 'lucide-react'
import { useIdeas } from '@/hooks/useIdeas'
import { useMax, MaxJob, MaxStatus } from '@/hooks/useMax'
import DashboardRouteTabs from '@/components/layout/DashboardRouteTabs'

// ─── Types ────────────────────────────────────────────────────────────────────

type StepDef = {
  key: MaxStatus
  label: string
  description: string
  icon: React.ReactNode
}

const PIPELINE_STEPS: StepDef[] = [
  {
    key:         'queued',
    label:       'Queued',
    description: 'Idea has been approved and is waiting to enter the pipeline.',
    icon:        <Clock size={15} />,
  },
  {
    key:         'generating_prompt',
    label:       'Generating Prompt',
    description: 'Creator is crafting a detailed production prompt tailored to the platform and content type.',
    icon:        <Wand2 size={15} />,
  },
  {
    key:         'prompt_ready',
    label:       'Prompt Ready',
    description: 'The production prompt has been finalised and is ready for model selection.',
    icon:        <CheckCircle2 size={15} />,
  },
  {
    key:         'selecting_model',
    label:       'Selecting Model',
    description: 'Evaluating available AI models and selecting the best one for this content format.',
    icon:        <Cpu size={15} />,
  },
  {
    key:         'generating_video',
    label:       'Generating Video',
    description: 'The selected model is rendering the video. This may take a few minutes.',
    icon:        <Film size={15} />,
  },
  {
    key:         'video_ready',
    label:       'Video Ready',
    description: 'Content has been generated successfully and is ready for review.',
    icon:        <Zap size={15} />,
  },
]

const STATUS_ORDER: MaxStatus[] = [
  'queued',
  'generating_prompt',
  'prompt_ready',
  'selecting_model',
  'generating_video',
  'video_ready',
]

function getStepState(stepKey: MaxStatus, currentStatus: MaxStatus): 'done' | 'active' | 'pending' | 'failed' {
  if (currentStatus === 'failed') return 'pending'
  const stepIdx   = STATUS_ORDER.indexOf(stepKey)
  const curIdx    = STATUS_ORDER.indexOf(currentStatus)
  if (curIdx < 0) return 'pending'
  if (stepIdx < curIdx)  return 'done'
  if (stepIdx === curIdx) return 'active'
  return 'pending'
}

// ─── Pipeline step row ────────────────────────────────────────────────────────

function PipelineStep({ step, state }: { step: StepDef; state: ReturnType<typeof getStepState> }) {
  const colors = {
    done:    { icon: 'var(--success)',     bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)',   text: 'var(--text-secondary)' },
    active:  { icon: 'var(--max-color)',   bg: 'var(--max-subtle)',      border: 'rgba(52,211,153,0.35)', text: 'var(--text-primary)' },
    pending: { icon: 'var(--text-muted)',  bg: 'var(--bg-elevated)',     border: 'var(--border)',          text: 'var(--text-muted)' },
    failed:  { icon: 'var(--destructive)', bg: 'var(--destructive-subtle)', border: 'rgba(239,68,68,0.3)', text: 'var(--text-muted)' },
  }
  const c = colors[state]

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14,
      padding: '14px 18px', borderRadius: 12,
      background: c.bg, border: `1px solid ${c.border}`,
      transition: 'all 0.3s',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: state === 'active' ? 'rgba(52,211,153,0.2)' : 'transparent',
        color: c.icon,
      }}>
        {state === 'active'
          ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
          : state === 'done'
            ? <CheckCircle2 size={15} />
            : step.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: state === 'pending' ? 'var(--text-muted)' : 'var(--text-primary)', margin: '0 0 3px' }}>
          {step.label}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
          {step.description}
        </p>
      </div>
      {state === 'active' && (
        <div style={{
          padding: '3px 10px', borderRadius: 99,
          background: 'rgba(52,211,153,0.18)', border: '1px solid rgba(52,211,153,0.4)',
          fontSize: 10, fontWeight: 700, color: 'var(--max-color)', whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          IN PROGRESS
        </div>
      )}
      {state === 'done' && (
        <div style={{
          padding: '3px 10px', borderRadius: 99,
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
          fontSize: 10, fontWeight: 700, color: 'var(--success)', flexShrink: 0,
        }}>
          DONE
        </div>
      )}
    </div>
  )
}

// ─── Video player ─────────────────────────────────────────────────────────────

function VideoPlayer({ videoUrl, title }: { videoUrl: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)

  function togglePlay() {
    if (!videoRef.current) return
    if (playing) { videoRef.current.pause(); setPlaying(false) }
    else { videoRef.current.play(); setPlaying(true) }
  }

  function toggleMute() {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(v => !v)
  }

  function handleTimeUpdate() {
    if (!videoRef.current) return
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100
    setProgress(isNaN(pct) ? 0 : pct)
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    if (!videoRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct  = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = pct * videoRef.current.duration
  }

  function handleFullscreen() {
    videoRef.current?.requestFullscreen?.()
  }

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      border: '1px solid rgba(52,211,153,0.3)',
      background: '#000',
      boxShadow: '0 0 40px rgba(52,211,153,0.12)',
    }}>
      {/* Video element */}
      <div style={{ position: 'relative', background: '#000', aspectRatio: '16/9' }}>
        <video
          ref={videoRef}
          src={videoUrl}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setPlaying(false)}
          onError={() => { /* demo fallback — ignore */ }}
        />
        {/* Click to play overlay */}
        {!playing && (
          <div
            onClick={togglePlay}
            style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', background: 'rgba(0,0,0,0.35)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}
          >
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'rgba(52,211,153,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(52,211,153,0.6)',
            }}>
              <Play size={22} fill="#000" style={{ marginLeft: 3 }} />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ padding: '10px 14px 12px', background: '#111' }}>
        {/* Progress bar */}
        <div
          onClick={handleSeek}
          style={{
            width: '100%', height: 4, borderRadius: 99,
            background: 'rgba(255,255,255,0.12)', cursor: 'pointer', marginBottom: 10,
          }}
        >
          <div style={{
            width: `${progress}%`, height: '100%', borderRadius: 99,
            background: 'var(--max-color)',
            transition: 'width 0.1s linear',
          }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={togglePlay} style={btnStyle}>
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={toggleMute} style={btnStyle}>
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <span style={{ flex: 1, fontSize: 11, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </span>
          <button onClick={handleFullscreen} style={btnStyle}>
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  color: 'rgba(255,255,255,0.7)', padding: '4px 6px', borderRadius: 6,
  display: 'flex', alignItems: 'center',
  transition: 'color 0.15s',
}

// ─── Prompt display ───────────────────────────────────────────────────────────

function PromptBox({ prompt, model }: { prompt?: string; model?: string }) {
  if (!prompt) return null
  return (
    <div style={{
      padding: '16px 18px', borderRadius: 12,
      background: 'var(--bg-card)', border: '1px solid var(--accent-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Wand2 size={13} style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Generated Prompt
        </span>
        {model && (
          <span style={{
            marginLeft: 'auto', fontSize: 10, fontWeight: 600,
            padding: '2px 9px', borderRadius: 99,
            background: 'var(--max-subtle)', border: '1px solid rgba(52,211,153,0.3)',
            color: 'var(--max-color)',
          }}>
            {model}
          </span>
        )}
      </div>
      <p style={{
        fontSize: 13, color: 'var(--text-secondary)', margin: 0,
        lineHeight: 1.7, whiteSpace: 'pre-wrap',
      }}>
        {prompt}
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreatorJobDetailPage({ onMenuOpen, isMobile }: { onMenuOpen: () => void; isMobile: boolean }) {
  const { ideaId } = useParams<{ ideaId: string }>()
  const navigate   = useNavigate()
  const { ideas }  = useIdeas()
  const approvedIdeas = useMemo(() => ideas.filter(i => i.status === 'approved'), [ideas])
  const { jobs, retryJob } = useMax(approvedIdeas)

  const job: MaxJob | null = jobs.find(j => j.ideaId === ideaId) ?? null

  if (!job) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <PageHeader job={null} onBack={() => navigate('/creator')} isMobile={isMobile} onMenuOpen={onMenuOpen} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexDirection: 'column' }}>
          <AlertCircle size={32} style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Job not found</p>
          <button onClick={() => navigate('/creator')} style={{
            padding: '9px 20px', borderRadius: 10, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13,
          }}>
            Back to Creator Dashboard
          </button>
        </div>
      </div>
    )
  }

  const isDone   = job.status === 'video_ready'
  const isFailed = job.status === 'failed'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <PageHeader job={job} onBack={() => navigate('/creator')} isMobile={isMobile} onMenuOpen={onMenuOpen} />

      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDone && !isMobile ? '1fr 420px' : '1fr',
          maxWidth: 1200, margin: '0 auto',
          padding: isMobile ? '20px 16px' : '28px 32px',
          gap: 28,
          alignItems: 'start',
        }}>

          {/* ── Left column: pipeline + prompt ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Idea info card */}
            <div style={{
              padding: '16px 18px', borderRadius: 14,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>💡</span>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                  {job.title}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Tag label={formatPlatformLabel(job.platform)} color='var(--accent)' />
                <Tag label={job.contentType === 'video' ? '🎬 Video' : '🖼 Image'} color='var(--text-secondary)' />
              </div>
            </div>

            {/* Pipeline */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
                Pipeline Progress
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PIPELINE_STEPS.map(step => (
                  <PipelineStep
                    key={step.key}
                    step={step}
                    state={isFailed ? (step.key === job.status ? 'failed' : 'pending') : getStepState(step.key, job.status)}
                  />
                ))}
              </div>
            </div>

            {/* Failed state */}
            {isFailed && (
              <div style={{
                padding: '16px 18px', borderRadius: 12,
                background: 'var(--destructive-subtle)', border: '1px solid rgba(239,68,68,0.3)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <AlertCircle size={18} style={{ color: 'var(--destructive)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--destructive)', margin: '0 0 2px' }}>Generation Failed</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                    {job.errorMessage || 'An unexpected error occurred during video generation.'}
                  </p>
                </div>
                <button
                  onClick={() => retryJob(job.ideaId)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 9, border: '1px solid rgba(239,68,68,0.4)',
                    background: 'transparent', color: 'var(--destructive)', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <RefreshCw size={13} />
                  Retry
                </button>
              </div>
            )}

            {/* Prompt box — show whenever we have a prompt */}
            <PromptBox prompt={job.prompt} model={job.model} />

            {/* Mobile: video below pipeline */}
            {isDone && isMobile && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
                  Generated Video
                </p>
                <VideoPlayer videoUrl={job.videoUrl!} title={job.title} />
              </div>
            )}
          </div>

          {/* ── Right column: video (desktop only) ── */}
          {isDone && !isMobile && (
            <div style={{ position: 'sticky', top: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
                Generated Video
              </p>
              <VideoPlayer videoUrl={job.videoUrl!} title={job.title} />

              {/* Ready badge */}
              <div style={{
                marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 12,
                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
              }}>
                <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>
                  Content ready for review
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 6,
      background: 'var(--bg-primary)', border: '1px solid var(--border)', color,
    }}>
      {label}
    </span>
  )
}

function formatPlatformLabel(platform: string) {
  if (platform === 'custom') return 'Custom Prompt'
  return platform.replace(/_/g, ' ').toUpperCase()
}

function PageHeader({
  job, onBack, isMobile, onMenuOpen,
}: {
  job: MaxJob | null
  onBack: () => void
  isMobile: boolean
  onMenuOpen: () => void
}) {
  const sc = job ? getStatusDisplay(job.status) : null

  return (
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
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      )}

      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 13, fontWeight: 500,
          padding: '6px 4px', borderRadius: 8, transition: 'color 0.15s', flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
        <ArrowLeft size={15} />
        {!isMobile && 'Creator'}
      </button>

      <div style={{ width: 1, height: 22, background: 'var(--border)' }} />

      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{
          fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {job?.title || 'Job Detail'}
        </p>
        {!isMobile && (
          <p style={{
            fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            Creator job details
          </p>
        )}
      </div>

      <DashboardRouteTabs isMobile={isMobile} />

      {sc && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 12px', borderRadius: 99,
          background: sc.bg, border: `1px solid ${sc.border}`,
          fontSize: 11, fontWeight: 600, color: sc.color,
          flexShrink: 0,
        }}>
          {sc.icon}
          {sc.label}
        </div>
      )}
    </header>
  )
}

function getStatusDisplay(status: MaxStatus) {
  switch (status) {
    case 'video_ready':
      return { label: 'Video Ready', color: 'var(--success)', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', icon: <CheckCircle2 size={11} /> }
    case 'failed':
      return { label: 'Failed', color: 'var(--destructive)', bg: 'var(--destructive-subtle)', border: 'rgba(239,68,68,0.3)', icon: <AlertCircle size={11} /> }
    case 'generating_video':
      return { label: 'Generating Video', color: 'var(--max-color)', bg: 'var(--max-subtle)', border: 'rgba(52,211,153,0.35)', icon: <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> }
    default:
      return { label: 'In Progress', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)', icon: <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> }
  }
}
