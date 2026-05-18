import { useState, useEffect, useCallback } from 'react'
import { Idea } from './useIdeas'
import { generateId } from '@/lib/utils'

export type MaxStatus =
  | 'queued'
  | 'generating_prompt'
  | 'prompt_ready'
  | 'selecting_model'
  | 'generating_video'
  | 'video_ready'
  | 'failed'

export type MaxJob = {
  id: string            // same as idea.id
  ideaId: string
  title: string
  platform: string
  contentType: 'video' | 'image'
  status: MaxStatus
  prompt?: string
  model?: string
  videoUrl?: string
  thumbnailUrl?: string
  startedAt: string
  updatedAt: string
  errorMessage?: string
  source?: 'idea' | 'custom'
  aspectRatio?: string
  audio?: boolean
  negativePrompt?: string
  references?: PromptReference[]
}

export type PromptReference = {
  id: string
  name: string
  kind: 'image' | 'video'
  mimeType: string
  size: number
}

export type CustomPromptInput = {
  description: string
  aspectRatio: string
  audio: boolean
  negativePrompt: string
  contentType: 'video' | 'image'
  references: PromptReference[]
}

const LS_KEY = 'cosmetology_max_jobs'

const STATUS_LABELS: Record<MaxStatus, string> = {
  queued:            'Queued',
  generating_prompt: 'Generating Prompt',
  prompt_ready:      'Prompt Ready',
  selecting_model:   'Selecting Model',
  generating_video:  'Generating Video',
  video_ready:       'Video Ready',
  failed:            'Failed',
}

const STATUS_ORDER: MaxStatus[] = [
  'queued',
  'generating_prompt',
  'prompt_ready',
  'selecting_model',
  'generating_video',
  'video_ready',
]

// Realistic mock prompts per platform
const MOCK_PROMPTS: Record<string, string[]> = {
  tiktok: [
    'Create a fast-paced, vertical 60-second TikTok video with trending audio. Open with a hook question in the first 3 seconds. Use jump cuts every 2–3 seconds to maintain pace. Include on-screen captions for each key point. End with a clear CTA to follow for part 2. Aesthetic: bright, high-contrast, minimal props.',
    'Produce a "day-in-my-life" style vertical video with authentic, slightly raw quality. Include b-roll of products being used naturally. Add text overlays with stats and facts timed to beat drops. Use a trending sound from the past 7 days. Hook: "I tried this for 30 days…"',
  ],
  instagram: [
    'Design a 9-slide carousel post optimised for saves. Slide 1: bold hook headline in large sans-serif type on a clean background. Slides 2–8: one key tip per slide with a minimal icon, body text under 40 words. Slide 9: CTA to save + share. Color palette: cream, sage, gold. Typography: Canva\'s "Tan Mon Cheri" for headlines, "DM Sans" for body.',
    'Create a single static infographic in a 1:1 square format. Use a bold contrasting headline at the top, followed by a 3-column comparison table. Bottom third: brand logo, CTA, and hashtag block. Color scheme: midnight navy + electric violet + white. Export at 1080×1080px.',
  ],
  youtube: [
    'Script and produce a 10–12 minute YouTube video in a talking-head + B-roll hybrid format. Structure: (0–30s) hook with end-result reveal, (30s–2m) problem statement, (2m–8m) step-by-step solution with screen overlays, (8m–10m) results + proof, (10m+) CTA for subscribe + next video. Thumbnail: high-contrast, shocked face, bold 3-word title, yellow arrow.',
    'Produce a listicle-style YouTube video: "X Things You Need to Know About [Topic]". Numbered chapters with YouTube timestamps. Each chapter 60–90 seconds. Use a consistent lower-third graphic for speaker name and chapter title. End screen at 20 seconds from end with 2 video cards.',
  ],
  twitter_ads: [
    'Design a native-feed Twitter/X ad creative in a 16:9 aspect ratio. Opening frame: text-only black background with a single provocative question. Frames 2–5: rapid before/after reveals. Final frame: product shot + offer text + URL. No logo until final frame. Keep text under 20% of frame. Duration: 6–15 seconds.',
    'Create a static Twitter ad card at 1200×675px. Headline: max 8 words, uses a number ("5 Things…", "1 Rule…"). Supporting copy: 2 sentences max. CTA button: "Learn More". Image: split-screen comparison, clean and high-contrast.',
  ],
}

const MOCK_MODELS: Record<string, string> = {
  tiktok:      'Runway Gen-3 Alpha Turbo',
  instagram:   'Adobe Firefly 3 (Image)',
  youtube:     'Sora v2 (OpenAI)',
  twitter_ads: 'Stable Video Diffusion 2.1',
}

// Fake video thumbnails — using placeholder gradient colors
const THUMBNAIL_COLORS = [
  '#7c6af7',
  '#34d399',
  '#fbbf24',
  '#f472b6',
  '#60a5fa',
]

function loadJobs(): MaxJob[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* */ }
  return []
}

function saveJobs(jobs: MaxJob[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(jobs))
  } catch { /* */ }
}

function getRandomPrompt(platform: string): string {
  const pool = MOCK_PROMPTS[platform] || MOCK_PROMPTS.instagram
  return pool[Math.floor(Math.random() * pool.length)]
}

function getModel(platform: string, contentType?: 'video' | 'image'): string {
  if (platform === 'custom') {
    return contentType === 'video'
      ? 'Sora v2 (OpenAI)'
      : 'Adobe Firefly 3 (Image)'
  }
  return MOCK_MODELS[platform] || 'Runway Gen-3 Alpha'
}

function getThumbnailColor(ideaId: string): string {
  const idx = ideaId.charCodeAt(0) % THUMBNAIL_COLORS.length
  return THUMBNAIL_COLORS[idx]
}

// Delays in ms for each step transition
const STEP_DELAYS: Partial<Record<MaxStatus, number>> = {
  queued:            1800,
  generating_prompt: 4000,
  prompt_ready:      1200,
  selecting_model:   2000,
  generating_video:  8000,
}

export function useMax(approvedIdeas: Idea[]) {
  const [jobs, setJobs] = useState<MaxJob[]>(() => loadJobs())

  // Sync: whenever a new approved idea arrives that has no job yet, create one
  useEffect(() => {
    const approvedAndCreator = approvedIdeas.filter(i => i.status === 'approved')
    setJobs(prev => {
      let changed = false
      let next = [...prev]
      for (const idea of approvedAndCreator) {
        if (!next.find(j => j.ideaId === idea.id)) {
          next = [
            {
              id:          idea.id,
              ideaId:      idea.id,
              title:       idea.topicHeading || idea.topic || 'Untitled',
              platform:    idea.platform,
              contentType: idea.contentType,
              status:      'queued',
              startedAt:   new Date().toISOString(),
              updatedAt:   new Date().toISOString(),
            },
            ...next,
          ]
          changed = true
        }
      }
      if (changed) saveJobs(next)
      return changed ? next : prev
    })
  }, [approvedIdeas])

  // Progress simulation: advance jobs that are not terminal
  useEffect(() => {
    const TERMINAL: MaxStatus[] = ['video_ready', 'failed']
    const pending = jobs.filter(j => !TERMINAL.includes(j.status))
    if (pending.length === 0) return

    const timers: ReturnType<typeof setTimeout>[] = []

    pending.forEach(job => {
      const delay = STEP_DELAYS[job.status] ?? 2000
      const t = setTimeout(() => {
        setJobs(prev => {
          const idx = prev.findIndex(j => j.id === job.id)
          if (idx < 0) return prev

          const current = prev[idx]
          const currentOrderIdx = STATUS_ORDER.indexOf(current.status)
          if (currentOrderIdx < 0 || currentOrderIdx >= STATUS_ORDER.length - 1) return prev

          const nextStatus = STATUS_ORDER[currentOrderIdx + 1]
          const patch: Partial<MaxJob> = {
            status:    nextStatus,
            updatedAt: new Date().toISOString(),
          }

          if (nextStatus === 'prompt_ready' && !current.prompt) {
            patch.prompt = getRandomPrompt(current.platform)
          }
          if (nextStatus === 'selecting_model') {
            patch.model = getModel(current.platform, current.contentType)
          }
          if (nextStatus === 'video_ready') {
            // In production this would be an actual URL. We use a data-URL-style placeholder.
            patch.videoUrl = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
            patch.thumbnailUrl = getThumbnailColor(current.ideaId)
          }

          const next = [...prev]
          next[idx] = { ...current, ...patch }
          saveJobs(next)
          return next
        })
      }, delay)
      timers.push(t)
    })

    return () => timers.forEach(clearTimeout)
  }, [jobs])

  const getJob = useCallback((ideaId: string) => {
    return jobs.find(j => j.ideaId === ideaId) ?? null
  }, [jobs])

  const retryJob = useCallback((ideaId: string) => {
    setJobs(prev => {
      const next = prev.map(j =>
        j.ideaId === ideaId
          ? { ...j, status: 'queued' as MaxStatus, updatedAt: new Date().toISOString(), errorMessage: undefined }
          : j
      )
      saveJobs(next)
      return next
    })
  }, [])

  const createCustomJob = useCallback((input: CustomPromptInput) => {
    const now = new Date().toISOString()
    const id = generateId()
    const title = input.description.trim().split(/\s+/).slice(0, 7).join(' ') || 'Custom prompt'
    const prompt = buildCustomPrompt(input)
    const job: MaxJob = {
      id,
      ideaId: id,
      title: title.length > 42 ? `${title.slice(0, 42).trim()}…` : title,
      platform: 'custom',
      contentType: input.contentType,
      status: 'queued',
      prompt,
      startedAt: now,
      updatedAt: now,
      source: 'custom',
      aspectRatio: input.aspectRatio,
      audio: input.audio,
      negativePrompt: input.negativePrompt.trim() || undefined,
      references: input.references,
    }

    setJobs(prev => {
      const next = [job, ...prev]
      saveJobs(next)
      return next
    })

    return job
  }, [])

  return { jobs, getJob, retryJob, createCustomJob, statusLabels: STATUS_LABELS }
}

export { STATUS_LABELS }

function buildCustomPrompt(input: CustomPromptInput) {
  const parts = [
    `Prompt description: ${input.description.trim()}`,
    `Aspect ratio: ${input.aspectRatio}`,
    `Audio: ${input.audio ? 'true' : 'false'}`,
  ]

  if (input.negativePrompt.trim()) {
    parts.push(`Negative prompts: ${input.negativePrompt.trim()}`)
  }

  if (input.references.length) {
    parts.push(
      `References: ${input.references.map(ref => `${ref.kind} ${ref.name}`).join(', ')}`
    )
  }

  return parts.join('\n')
}
