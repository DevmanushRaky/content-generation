import { Camera, Music2, Play, X, Megaphone } from 'lucide-react'

export const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', Icon: Camera },
  { id: 'tiktok', label: 'TikTok', Icon: Music2 },
  { id: 'youtube', label: 'YouTube', Icon: Play },
  { id: 'twitter', label: 'Twitter / X', Icon: X },
  { id: 'twitter_ads', label: 'Twitter Ads', Icon: Megaphone },
]

export const PLATFORM_META = {
  instagram:   { label: 'Instagram',   color: '#E1306C', bg: 'rgba(225,48,108,0.08)', border: 'rgba(225,48,108,0.25)', Icon: Camera },
  tiktok:      { label: 'TikTok',      color: '#69C9D0', bg: 'rgba(105,201,208,0.08)', border: 'rgba(105,201,208,0.25)', Icon: Music2 },
  youtube:     { label: 'YouTube',     color: '#FF0000', bg: 'rgba(255,0,0,0.08)',     border: 'rgba(255,0,0,0.22)',   Icon: Play },
  twitter:     { label: 'Twitter / X', color: '#1DA1F2', bg: 'rgba(29,161,242,0.08)',  border: 'rgba(29,161,242,0.22)', Icon: X },
  twitter_ads: { label: 'Twitter Ads', color: '#1DA1F2', bg: 'rgba(29,161,242,0.08)',  border: 'rgba(29,161,242,0.22)', Icon: Megaphone },
}

export const DEFAULT_RESEARCH_PLATFORMS = PLATFORMS.map(p => p.id)

