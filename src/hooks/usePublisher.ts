import { useState, useCallback } from 'react'
import type { MaxJob } from './useMax'

// ─── Types ────────────────────────────────────────────────────────────────────

export type PublishStatus = 'pending' | 'scheduled' | 'published'

export type PlatformCaption = {
  platform: string
  caption: string
  hashtags: string[]
}

export type BestTimeSlot = {
  day: string
  time: string
  label: string   // e.g. "Peak Engagement"
  reason: string
}

export type PublisherEntry = {
  id: string
  ideaId: string
  title: string
  platform: string
  contentType: 'video' | 'image'
  videoUrl?: string
  thumbnailUrl?: string
  prompt?: string
  model?: string
  publishStatus: PublishStatus
  scheduledAt?: string   // ISO
  publishedAt?: string   // ISO
  sentAt: string         // ISO — when it was sent from Creator
  captions: PlatformCaption[]
  bestTimes: BestTimeSlot[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_KEY = 'cosmetology_publisher_entries'

// ─── Mock caption generator ───────────────────────────────────────────────────

const CAPTION_POOLS: Record<string, { captions: string[]; hashtags: string[] }> = {
  tiktok: {
    captions: [
      "POV: You just discovered the skincare secret everyone's been sleeping on 🤫✨ Watch till the end — your skin will thank you.",
      "This is your sign to finally fix your skincare routine 🌿 Drop a 🙋 if your skin has been struggling lately!",
      "I spent 30 days testing this so you don't have to 👀 The results are genuinely unreal. Save this before it blows up.",
    ],
    hashtags: ['#skincare', '#skintok', '#glowup', '#skincareрутина', '#fyp', '#skincaretips', '#glowskin'],
  },
  instagram: {
    captions: [
      "Your skin deserves better, and this is where we start 🌸\n\nSwipe → for the full breakdown. Save this post — you'll want to come back to it.",
      "Hot take: most people are overcomplicating their skincare 💭\n\nHere's what actually works (and what to ditch). Save + share with a friend who needs this.",
      "Glow is not a product. It's a practice ✨\n\nEverything you need to know is in the carousel. Link in bio for the full guide.",
    ],
    hashtags: ['#skincareroutine', '#glowskin', '#skincarecommunity', '#beautytips', '#selfcare', '#skincareobsessed'],
  },
  youtube: {
    captions: [
      "I've been testing this for 3 months and the results changed everything about how I approach skincare. Honest review, no sponsorship — just results.",
      "WATCH BEFORE YOU BUY: I tested 10 of the most-hyped skincare products so you don't waste your money. Timestamps below 👇",
      "The complete beginner's guide to building a skincare routine that actually works — broken down step by step, no fluff.",
    ],
    hashtags: ['#skincarereviews', '#skincareroutine', '#glowup', '#youtubeskincommunity', '#beautyyoutuber'],
  },
  twitter_ads: {
    captions: [
      "Most people are using the wrong products for their skin type. Here's a 60-second fix. 👇",
      "Your skin barrier is the foundation of everything. Are you protecting it?",
      "Before you buy another serum — read this. It'll save you a lot of money.",
    ],
    hashtags: ['#skincare', '#beauty', '#glowup'],
  },
  twitter: {
    captions: [
      "Hot take: the skincare industry is overcomplicating everything on purpose. Here's what you actually need 🧵",
      "I've tested 40+ skincare products this year. The best ones cost less than ₹500. Thread 👇",
      "Nobody talks about this skincare mistake and it's ruining people's results. Let me explain.",
    ],
    hashtags: ['#skincare', '#skincaretwitter', '#beautytips'],
  },
  default: {
    captions: [
      "Game-changing skincare insights — save this before it disappears from your feed.",
      "Everything you need to know in one place. No fluff, just results.",
      "Your skin transformation starts here. Watch the full video.",
    ],
    hashtags: ['#skincare', '#beauty', '#glowup', '#selfcare'],
  },
}

function generateCaptions(platform: string, title: string): PlatformCaption[] {
  const pool = CAPTION_POOLS[platform] || CAPTION_POOLS.default

  // Generate 3 caption variants for the primary platform
  const primaryCaptions = pool.captions.map((c, i) => ({
    platform,
    caption: c,
    hashtags: pool.hashtags.slice(0, 4 + i),
  }))

  return primaryCaptions
}

// ─── Mock best-time generator ─────────────────────────────────────────────────

const BEST_TIMES_BY_PLATFORM: Record<string, BestTimeSlot[]> = {
  tiktok: [
    { day: 'Tuesday',   time: '7:00 PM',  label: 'Peak Engagement',   reason: 'Evening commute scroll — TikTok FYP is most competitive and most rewarding at this window.' },
    { day: 'Friday',    time: '9:00 PM',  label: 'Weekend Kickoff',    reason: 'Pre-weekend mood drives discovery content consumption; shares spike on Fri evenings.' },
    { day: 'Sunday',    time: '11:00 AM', label: 'Lazy Morning Browse', reason: 'Highest average watch-through rate for lifestyle content — users are relaxed and unrushed.' },
  ],
  instagram: [
    { day: 'Wednesday', time: '11:00 AM', label: 'Midweek Sweet Spot', reason: 'Instagram\'s algorithm favours posts that accumulate saves in the first 2 hours; Wed 11AM hits the largest active audience.' },
    { day: 'Monday',    time: '8:00 AM',  label: 'Week Starter',       reason: 'Motivation-seeking behaviour on Monday mornings means beauty + skincare content sees above-average reach.' },
    { day: 'Saturday',  time: '10:00 AM', label: 'Weekend Discovery',  reason: 'Saturday mornings are self-care planning time — users save content for later purchase decisions.' },
  ],
  youtube: [
    { day: 'Saturday',  time: '12:00 PM', label: 'Peak Watch Time',    reason: 'YouTube watch time peaks Saturday afternoons; long-form skincare reviews get 40% more completions vs weekdays.' },
    { day: 'Sunday',    time: '3:00 PM',  label: 'Afternoon Deep Dive', reason: 'Sunday afternoon is the top slot for 8–15 min educational videos — viewers have time to commit.' },
    { day: 'Thursday',  time: '7:00 PM',  label: 'Pre-Weekend Upload',  reason: 'Uploading Thursday evening seeds the algorithm to surface the video on Friday–Saturday when watch-time is highest.' },
  ],
  twitter_ads: [
    { day: 'Tuesday',   time: '9:00 AM',  label: 'Morning CTR Spike',  reason: 'B2C Twitter ads see highest click-through rates Tuesday mornings when users check feeds before work.' },
    { day: 'Thursday',  time: '1:00 PM',  label: 'Lunch Scroll',       reason: 'Lunch-break browsing has higher purchase intent — great for educational ad formats.' },
    { day: 'Wednesday', time: '12:00 PM', label: 'Midweek Attention',   reason: 'Lowest ad competition midweek at noon means lower CPM and higher impression share.' },
  ],
  default: [
    { day: 'Wednesday', time: '12:00 PM', label: 'Midweek Peak',       reason: 'Mid-week content typically captures the widest cross-platform audience.' },
    { day: 'Saturday',  time: '10:00 AM', label: 'Weekend Discovery',  reason: 'Weekend mornings show consistent content discovery spikes across all major platforms.' },
    { day: 'Sunday',    time: '6:00 PM',  label: 'Evening Engagement', reason: 'Sunday evenings drive the highest engagement rates for lifestyle and beauty content.' },
  ],
}

function generateBestTimes(platform: string): BestTimeSlot[] {
  return BEST_TIMES_BY_PLATFORM[platform] || BEST_TIMES_BY_PLATFORM.default
}

// ─── Persistence ──────────────────────────────────────────────────────────────

function loadEntries(): PublisherEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* */ }
  return []
}

function saveEntries(entries: PublisherEntry[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(entries))
  } catch { /* */ }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function usePublisher() {
  const [entries, setEntries] = useState<PublisherEntry[]>(() => loadEntries())

  /** Called from CreatorJobDetailPage when user clicks "Publish" */
  const sendToPublisher = useCallback((job: MaxJob) => {
    setEntries(prev => {
      // Don't duplicate
      if (prev.find(e => e.ideaId === job.ideaId)) return prev
      const entry: PublisherEntry = {
        id: job.ideaId,
        ideaId: job.ideaId,
        title: job.title,
        platform: job.platform,
        contentType: job.contentType,
        videoUrl: job.videoUrl,
        thumbnailUrl: job.thumbnailUrl,
        prompt: job.prompt,
        model: job.model,
        publishStatus: 'pending',
        sentAt: new Date().toISOString(),
        captions: generateCaptions(job.platform, job.title),
        bestTimes: generateBestTimes(job.platform),
      }
      const next = [entry, ...prev]
      saveEntries(next)
      return next
    })
  }, [])

  /** Schedule for a specific ISO date/time */
  const scheduleEntry = useCallback((ideaId: string, isoDate: string) => {
    setEntries(prev => {
      const next = prev.map(e =>
        e.ideaId === ideaId
          ? { ...e, publishStatus: 'scheduled' as PublishStatus, scheduledAt: isoDate }
          : e
      )
      saveEntries(next)
      return next
    })
  }, [])

  /** Publish immediately */
  const publishNow = useCallback((ideaId: string) => {
    setEntries(prev => {
      const next = prev.map(e =>
        e.ideaId === ideaId
          ? { ...e, publishStatus: 'published' as PublishStatus, publishedAt: new Date().toISOString() }
          : e
      )
      saveEntries(next)
      return next
    })
  }, [])

  const getEntry = useCallback((ideaId: string): PublisherEntry | null => {
    return entries.find(e => e.ideaId === ideaId) ?? null
  }, [entries])

  return { entries, sendToPublisher, scheduleEntry, publishNow, getEntry }
}
