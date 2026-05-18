import { NavLink, useLocation } from 'react-router-dom'
import { Sun, Moon, ChevronLeft, ChevronRight, ChevronDown, LayoutDashboard, X } from 'lucide-react'
import { DASHBOARD_ROUTES, SETTINGS_ROUTE } from './dashboardRoutes'
import { useEffect, useMemo, useState } from 'react'

export default function Sidebar({ theme, onToggleTheme, collapsed, onToggleCollapse, mobileOpen, onMobileClose }) {
  const width = collapsed ? 64 : 220
  const location = useLocation()
  const [dashboardOpen, setDashboardOpen] = useState(true)

  const dashboardActive = useMemo(
    () => DASHBOARD_ROUTES.some(route => location.pathname === route.path || location.pathname.startsWith(`${route.path}/`)),
    [location.pathname],
  )

  useEffect(() => {
    if (dashboardActive) setDashboardOpen(true)
  }, [dashboardActive])

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.5)',
            display: 'none',
          }}
          className="mobile-backdrop"
        />
      )}

      <aside
        style={{
          width,
          minWidth: width,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 30,
          flexShrink: 0,
        }}
      >
        {/* ── Logo ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 16px',
          height: 64,
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            color: '#fff',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '-0.5px',
          }}>
            Co
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', margin: 0 }}>
                Cosmetology
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', margin: 0 }}>
                Agent Dashboard
              </p>
            </div>
          )}
          {/* Mobile close button */}
          {mobileOpen && !collapsed && (
            <button
              onClick={onMobileClose}
              style={{
                marginLeft: 'auto', background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 4, borderRadius: 6, flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── Nav ── */}
        <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            type="button"
            onClick={() => setDashboardOpen(v => !v)}
            title={collapsed ? 'Dashboard' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '10px 0' : '10px 14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 10,
              border: dashboardActive ? '1px solid var(--accent-border)' : '1px solid transparent',
              background: dashboardActive ? 'var(--accent-subtle)' : 'transparent',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.15s',
              color: dashboardActive ? 'var(--accent)' : 'var(--text-secondary)',
            }}
            onMouseEnter={e => {
              if (!dashboardActive) e.currentTarget.style.background = 'var(--bg-hover)'
            }}
            onMouseLeave={e => {
              if (!dashboardActive) e.currentTarget.style.background = 'transparent'
            }}
          >
            {dashboardActive && (
              <span style={{
                position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                width: 3, height: 20, borderRadius: '0 3px 3px 0',
                background: 'var(--accent)',
              }} />
            )}
            <LayoutDashboard size={17} style={{ flexShrink: 0 }} />
            {!collapsed && (
              <>
                <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>Dashboard</span>
                <ChevronDown
                  size={15}
                  style={{
                    flexShrink: 0,
                    transition: 'transform 0.15s',
                    transform: dashboardOpen ? 'rotate(180deg)' : 'none',
                  }}
                />
              </>
            )}
          </button>

          {dashboardOpen && DASHBOARD_ROUTES.map(({ path, icon: Icon, label, color, subtle, border, id }) => (
            <NavLink
              key={id}
              to={path}
              end={path === '/researcher'}
              onClick={onMobileClose}
              title={collapsed ? label : undefined}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => {
                const activeColor = color || 'var(--accent)'
                const activeBg = subtle || 'var(--accent-subtle)'
                const activeBorderColor = border || 'var(--accent-border)'
                return (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: collapsed ? '9px 0' : '9px 14px 9px 28px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: 10,
                    background: isActive ? activeBg : 'transparent',
                    border: isActive ? `1px solid ${activeBorderColor}` : '1px solid transparent',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.15s',
                  }}>
                    {isActive && (
                      <span style={{
                        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                        width: 3, height: 20, borderRadius: '0 3px 3px 0',
                        background: activeColor,
                      }} />
                    )}
                    <Icon
                      size={16}
                      style={{ color: isActive ? activeColor : 'var(--text-muted)', flexShrink: 0 }}
                    />
                    {!collapsed && (
                      <span style={{
                        fontSize: 13, fontWeight: 500,
                        color: isActive ? activeColor : 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                      }}>
                        {label}
                      </span>
                    )}
                  </div>
                )
              }}
            </NavLink>
          ))}

          <NavLink
            to={SETTINGS_ROUTE.path}
            end
            onClick={onMobileClose}
            title={collapsed ? SETTINGS_ROUTE.label : undefined}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => {
              const activeColor = SETTINGS_ROUTE.color
              const activeBg = SETTINGS_ROUTE.subtle
              const activeBorderColor = SETTINGS_ROUTE.border
              const Icon = SETTINGS_ROUTE.icon
              return (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: collapsed ? '10px 0' : '10px 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 10,
                  background: isActive ? activeBg : 'transparent',
                  border: isActive ? `1px solid ${activeBorderColor}` : '1px solid transparent',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.15s',
                }}>
                  {isActive && (
                    <span style={{
                      position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                      width: 3, height: 20, borderRadius: '0 3px 3px 0',
                      background: activeColor,
                    }} />
                  )}
                  <Icon
                    size={17}
                    style={{ color: isActive ? activeColor : 'var(--text-muted)', flexShrink: 0 }}
                  />
                  {!collapsed && (
                    <span style={{
                      fontSize: 13, fontWeight: 500,
                      color: isActive ? activeColor : 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                    }}>
                      {SETTINGS_ROUTE.label}
                    </span>
                  )}
                </div>
              )
            }}
          </NavLink>
        </nav>

        {/* ── Bottom controls ── */}
        <div style={{ padding: '12px 10px 16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Theme toggle */}
          <SidebarBtn
            icon={theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            collapsed={collapsed}
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          />
          {/* Collapse toggle — desktop only */}
          <SidebarBtn
            icon={collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            label="Collapse"
            collapsed={collapsed}
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hide-on-mobile"
          />
        </div>
      </aside>
    </>
  )
}

function SidebarBtn({ icon, label, collapsed, onClick, title, className }: {
  icon: any; label: string; collapsed: boolean; onClick: () => void; title?: string; className?: string
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: collapsed ? '10px 0' : '10px 14px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 10,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        width: '100%',
        transition: 'background 0.15s',
        color: 'var(--text-muted)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ flexShrink: 0, display: 'flex' }}>{icon}</span>
      {!collapsed && (
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
          {label}
        </span>
      )}
    </button>
  )
}
