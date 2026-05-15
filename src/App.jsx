import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import DashboardPage from '@/pages/DashboardPage'
import SettingsPage from '@/pages/SettingsPage'
import GenerateIdeasPage from '@/pages/GenerateIdeasPage'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    function onResize() {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function toggleTheme() {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }

  // On mobile, sidebar is always full-width overlay, never collapsed
  const showSidebar = isMobile ? mobileOpen : true
  const sidebarCollapsed = isMobile ? false : collapsed

  return (
    <BrowserRouter>
      <div
        data-theme={theme}
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          background: 'var(--bg-primary)',
          position: 'relative',
        }}
      >
        {/* Mobile backdrop */}
        {isMobile && mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(2px)',
            }}
          />
        )}

        {/* Sidebar */}
        <div
          style={{
            position: isMobile ? 'fixed' : 'relative',
            top: 0, left: 0, bottom: 0,
            zIndex: isMobile ? 50 : 'auto',
            transform: isMobile && !mobileOpen ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
            height: '100%',
          }}
        >
          <Sidebar
            theme={theme}
            onToggleTheme={toggleTheme}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setCollapsed(v => !v)}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />
        </div>

        {/* Main content */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'var(--bg-primary)',
            minWidth: 0,
          }}
        >
          <Routes>
            <Route path="/" element={
              <DashboardPage onMenuOpen={() => setMobileOpen(true)} isMobile={isMobile} />
            } />
            <Route path="/generate-ideas" element={
              <GenerateIdeasPage onMenuOpen={() => setMobileOpen(true)} isMobile={isMobile} />
            } />
            <Route path="/settings" element={
              <SettingsPage onMenuOpen={() => setMobileOpen(true)} isMobile={isMobile} />
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
