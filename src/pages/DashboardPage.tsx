import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ScrapePanel from '@/components/dashboard/ScrapePanel'
import ProcessingLoader from '@/components/dashboard/ProcessingLoader'
import IdeasTable from '@/components/dashboard/IdeasTable'
import { useIdeas } from '@/hooks/useIdeas'
import { Menu } from 'lucide-react'
import DashboardRouteTabs from '@/components/layout/DashboardRouteTabs'
import { DASHBOARD_ROUTES } from '@/components/layout/dashboardRoutes'

export default function DashboardPage({ onMenuOpen, isMobile }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { view, ideas, runScrapeJob, resetToScrape, goHome } = useIdeas()
  const researcherRoute = DASHBOARD_ROUTES.find(route => route.id === 'researcher')

  // Open scrape panel when arriving via ?view=scrape (e.g. from Generate Ideas → New Research)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('view') === 'scrape') {
      resetToScrape()
      navigate('/researcher', { replace: true })
    }
  }, [location.search, navigate, resetToScrape])

  // When processing finishes, navigate to /generate-ideas
  const prevView = useRef(view)
  useEffect(() => {
    if (prevView.current === 'processing' && view === 'home') {
      navigate('/generate-ideas')
    }
    prevView.current = view
  }, [view, navigate])

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--soul-color) 0%, #4f46e5 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, flexShrink: 0, boxShadow: '0 0 18px rgba(124,106,247,0.28)',
          }}>
            🔮
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Researcher
            </p>
          </div>
        </div>

        <DashboardRouteTabs isMobile={isMobile} />

        {/* Route tagline — desktop */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--soul-color)', fontWeight: 600 }}>{researcherRoute?.label ?? 'Researcher'}</span>
            <span>·</span>
            <span>{researcherRoute?.tagline ?? 'Research and idea intake'}</span>
          </div>
        )}

        <div style={{ flex: 1 }} />

      </header>

      {/* ── Main content area ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', minHeight: 0 }}>
        {view === 'home' && (
          <IdeasTable
            ideas={ideas}
            onNewResearch={resetToScrape}
          />
        )}
        {view === 'scrape' && (
          <ScrapePanel onSubmit={runScrapeJob} onBack={goHome} />
        )}
        {view === 'processing' && (
          <ProcessingLoader />
        )}
      </div>
    </div>
  )
}
