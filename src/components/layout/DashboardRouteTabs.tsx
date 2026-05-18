import { NavLink } from 'react-router-dom'
import { DASHBOARD_ROUTES } from './dashboardRoutes'

type DashboardRouteTabsProps = {
  isMobile?: boolean
}

export default function DashboardRouteTabs({ isMobile = false }: DashboardRouteTabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 4,
        flexShrink: 0,
        overflowX: 'auto',
        maxWidth: '100%',
      }}
    >
      {DASHBOARD_ROUTES.map(route => (
        <NavLink
          key={route.id}
          to={route.path}
          title={isMobile ? route.label : undefined}
          style={{ textDecoration: 'none', flexShrink: 0 }}
        >
          {({ isActive }) => {
            const Icon = route.icon
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: isMobile ? '7px 10px' : '7px 14px',
                  borderRadius: 9,
                  border: isActive ? `1px solid ${route.border}` : '1px solid transparent',
                  background: isActive ? route.subtle : 'transparent',
                  color: isActive ? route.color : 'var(--text-muted)',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = 'transparent'
                }}
              >
                <Icon size={15} />
                <span>{route.label}</span>
              </div>
            )
          }}
        </NavLink>
      ))}
    </div>
  )
}
