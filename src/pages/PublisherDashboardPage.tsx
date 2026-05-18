import { Menu, Rocket } from 'lucide-react'
import DashboardRouteTabs from '@/components/layout/DashboardRouteTabs'
import { DASHBOARD_ROUTES } from '@/components/layout/dashboardRoutes'

export default function PublisherDashboardPage({ onMenuOpen, isMobile }: { onMenuOpen: () => void; isMobile: boolean }) {
  const publisherRoute = DASHBOARD_ROUTES.find(route => route.id === 'publisher')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--nova-color) 0%, #f59e0b 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, flexShrink: 0, boxShadow: '0 0 18px rgba(251,191,36,0.28)',
          }}>
            <Rocket size={17} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Publisher
            </p>
          </div>
        </div>

        <DashboardRouteTabs isMobile={isMobile} />
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--nova-color)', fontWeight: 600 }}>{publisherRoute?.label ?? 'Publisher'}</span>
            <span>·</span>
            <span>{publisherRoute?.tagline ?? 'Publishing and distribution'}</span>
          </div>
        )}

        <div style={{ flex: 1 }} />
      </header>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'var(--bg-primary)',
      }}>
        <div style={{
          maxWidth: 520,
          width: '100%',
          padding: 24,
          borderRadius: 20,
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
          textAlign: 'center',
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            margin: '0 auto 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--nova-subtle)',
            border: '1px solid rgba(251,191,36,0.35)',
            color: 'var(--nova-color)',
          }}>
            <Rocket size={30} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px' }}>
            Publisher coming soon
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
            The publisher route is reserved for scheduling, distribution, and publishing controls.
            You can switch to Researcher or Creator from the top navigation at any time.
          </p>
        </div>
      </div>
    </div>
  )
}
