import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ScrapePanel from '@/components/dashboard/ScrapePanel'
import ProcessingLoader from '@/components/dashboard/ProcessingLoader'
import IdeasTable from '@/components/dashboard/IdeasTable'
import { useIdeas } from '@/hooks/useIdeas'
import { Menu } from 'lucide-react'

const AGENTS = [
  { id: 'researcher', label: 'Researcher', icon: '🔮', tagline: 'Content Research',    color: 'var(--soul-color)', subtle: 'var(--soul-subtle)',         border: 'var(--accent-border)' },
  { id: 'creator', label: 'Creator', icon: '✍️',  tagline: 'Content Generation', color: 'var(--max-color)',  subtle: 'rgba(52,211,153,0.12)',     border: 'rgba(52,211,153,0.35)' },
  { id: 'publisher', label: 'Publisher', icon: '🚀', tagline: 'Publishing',           color: 'var(--nova-color)', subtle: 'rgba(251,191,36,0.12)',     border: 'rgba(251,191,36,0.35)' },
]

function AgentPlaceholder({ agent }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20, fontSize: 34,
        background: agent.subtle, border: `1px solid ${agent.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {agent.icon}
      </div>
      <div style={{ textAlign: 'center', maxWidth: 360 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
          {agent.label} — {agent.tagline}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
          {agent.id === 'creator'
            ? 'Once Researcher surfaces trending ideas, Creator will craft polished captions, scripts, and copy tailored to your brand voice. Coming soon.'
            : agent.id === 'publisher'
              ? 'Publisher connects to Publer and distributes your approved content across all configured social channels automatically. Coming soon.'
              : 'Researcher scans trends across platforms and surfaces what is resonating right now. Coming soon.'}
        </p>
      </div>
      <div style={{
        padding: '7px 18px', borderRadius: 99,
        background: agent.subtle, border: `1px solid ${agent.border}`,
        fontSize: 12, fontWeight: 600, color: agent.color,
      }}>
        Coming Soon
      </div>
    </div>
  )
}

export default function DashboardPage({ onMenuOpen, isMobile }) {
  const [activeAgent, setActiveAgent] = useState('researcher')
  const navigate = useNavigate()
  const location = useLocation()
  const { view, ideas, runScrapeJob, resetToScrape, goHome } = useIdeas()

  // Open scrape panel when arriving via ?view=scrape (e.g. from Generate Ideas → New Research)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('view') === 'scrape') {
      resetToScrape()
      navigate('/', { replace: true })
    }
  }, [location.search]) // eslint-disable-line react-hooks/exhaustive-deps

  // When processing finishes, navigate to /generate-ideas
  const prevView = useRef(view)
  useEffect(() => {
    if (prevView.current === 'processing' && view === 'home') {
      navigate('/generate-ideas')
    }
    prevView.current = view
  }, [view, navigate])

  const agent = AGENTS.find(a => a.id === activeAgent)
  const isResearcher = activeAgent === 'researcher'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Top header ── */}
      <header style={{
        display: 'flex', alignItems: 'center',
        padding: '0 20px', height: 64, minHeight: 64,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        flexShrink: 0, gap: 16, zIndex: 20,
      }}>

        {/* Hamburger — mobile only */}
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

        {/* ── Horizontal Agent Tabs ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'var(--bg-primary)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 4, flexShrink: 0,
        }}>
          {AGENTS.map(ag => {
            const isActive = activeAgent === ag.id
            return (
              <button
                key={ag.id}
                id={`agent-tab-${ag.id}`}
                onClick={() => setActiveAgent(ag.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: isMobile ? '7px 10px' : '7px 14px',
                  borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: isActive ? ag.subtle : 'transparent',
                  outline: isActive ? `1px solid ${ag.border}` : 'none',
                  color: isActive ? ag.color : 'var(--text-muted)',
                  fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 15, lineHeight: 1 }}>{ag.icon}</span>
                <span>{ag.label}</span>
              </button>
            )
          })}
        </div>

        {/* Agent tagline — desktop */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ color: agent.color, fontWeight: 600 }}>{agent.label}</span>
            <span>·</span>
            <span>{agent.tagline}</span>
          </div>
        )}

        <div style={{ flex: 1 }} />

      </header>

      {/* ── Main content area ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', minHeight: 0 }}>
        {isResearcher && view === 'home' && (
          <IdeasTable
            ideas={ideas}
            onNewResearch={resetToScrape}
          />
        )}
        {isResearcher && view === 'scrape' && (
          <ScrapePanel onSubmit={runScrapeJob} onBack={goHome} />
        )}
        {isResearcher && view === 'processing' && (
          <ProcessingLoader />
        )}
        {!isResearcher && (
          <AgentPlaceholder agent={agent} />
        )}
      </div>
    </div>
  )
}
