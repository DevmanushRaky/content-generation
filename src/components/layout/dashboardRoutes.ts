import { Sparkles, PenSquare, Rocket, Settings } from 'lucide-react'

export type DashboardRouteId = 'researcher' | 'creator' | 'publisher'

export type DashboardRoute = {
  id: DashboardRouteId
  path: string
  label: string
  tagline: string
  icon: typeof Sparkles
  color: string
  subtle: string
  border: string
}

export const DASHBOARD_ROUTES: DashboardRoute[] = [
  {
    id: 'researcher',
    path: '/researcher',
    label: 'Researcher',
    tagline: 'Research and idea intake',
    icon: Sparkles,
    color: 'var(--soul-color)',
    subtle: 'var(--soul-subtle)',
    border: 'var(--accent-border)',
  },
  {
    id: 'creator',
    path: '/creator',
    label: 'Creator',
    tagline: 'Content generation and production',
    icon: PenSquare,
    color: 'var(--max-color)',
    subtle: 'var(--max-subtle)',
    border: 'rgba(52,211,153,0.35)',
  },
  {
    id: 'publisher',
    path: '/publisher',
    label: 'Publisher',
    tagline: 'Publishing and distribution',
    icon: Rocket,
    color: 'var(--nova-color)',
    subtle: 'var(--nova-subtle)',
    border: 'rgba(251,191,36,0.35)',
  },
]

export const SETTINGS_ROUTE = {
  id: 'settings',
  path: '/settings',
  label: 'Settings',
  icon: Settings,
  color: 'var(--text-secondary)',
  subtle: 'var(--bg-hover)',
  border: 'var(--border)',
} as const
