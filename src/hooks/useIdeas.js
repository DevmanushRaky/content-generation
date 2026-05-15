import { useState, useCallback } from 'react'
import { generateId } from '@/lib/utils'
import { DEFAULT_RESEARCH_PLATFORMS } from '@/components/dashboard/platforms'

const LS_KEY = 'cosmetology_ideas'
const LS_BATCH_KEY = 'cosmetology_latest_batch'
const STAGE_ORDER = ['soul', 'max', 'nova', 'published']

function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function normalizeIdea(idea) {
  const stage = idea.stage || (idea.status === 'approved' ? 'max' : 'soul')
  const platform = idea.platform === 'pinterest' || idea.platform === 'reddit' ? 'twitter_ads' : idea.platform
  return { ...idea, stage, platform }
}

function nextStage(stage) {
  const currentIndex = STAGE_ORDER.indexOf(stage)
  if (currentIndex < 0 || currentIndex >= STAGE_ORDER.length - 1) return stage || 'soul'
  return STAGE_ORDER[currentIndex + 1]
}

// ─── Dummy seed data shown on first load ───────────────────────────────────
const DUMMY_IDEAS = [
  {
    id: 'dummy-1', rank: 1, batchId: 'dummy-batch',
    topicHeading: 'Glass Skin Routine: Step-by-Step for Beginners',
    topic: 'glass skin',
    platform: 'tiktok', contentType: 'video',
    sourceUrl: 'https://www.tiktok.com/@glowwithmeera/video/7341892034561234945',
    likes: 284000, likesFormatted: '284K',
    views: 2100000, viewsFormatted: '2.1M',
    duration: '3:12',
    trendScore: 98,
    whyPopular: 'The "glass skin" aesthetic taps into aspirational beauty with a tangible, replicable process. This video broke it into 6 numbered steps with satisfying close-up transitions between each product. The before/after at the 2:50 mark caused a massive share spike — viewers tagged friends saying "this is literally us." TikTok\'s algorithm rewarded the 92% average watch-through rate by pushing it to the "Skincare For You" FYP cluster.',
    status: 'pending', stage: 'soul', generatedAt: daysAgo(1),
  },
  {
    id: 'dummy-2', rank: 2, batchId: 'dummy-batch',
    topicHeading: 'Vitamin C Serum: Which One Actually Works Under ₹800?',
    topic: 'vitamin C serum',
    platform: 'instagram', contentType: 'image',
    sourceUrl: 'https://www.instagram.com/p/C8kQm2xLpTa/',
    likes: 143000, likesFormatted: '143K',
    views: null, viewsFormatted: null,
    duration: null,
    trendScore: 94,
    whyPopular: 'Price-anchored ingredient reviews dominate Instagram saves. This carousel compared 5 drugstore vitamin C serums with identical photography — same lighting, same swatch style — which signals credibility and effort. Slide 4 (the ranking reveal) had a 78% swipe-through rate. The ₹800 cap made it instantly shareable to Indian audiences who feel priced out of imported serums.',
    status: 'approved', stage: 'max', generatedAt: daysAgo(2),
  },
  {
    id: 'dummy-3', rank: 3, batchId: 'dummy-batch',
    topicHeading: '"Skin Flooding" Trend Explained + My Results After 14 Days',
    topic: 'skin flooding',
    platform: 'youtube', contentType: 'video',
    sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    likes: 97400, likesFormatted: '97.4K',
    views: 1340000, viewsFormatted: '1.3M',
    duration: '11:47',
    trendScore: 91,
    whyPopular: 'Trend-reaction videos perform exceptionally when the creator adds personal documentation. "I tried it for 14 days" framing creates a narrative arc that holds viewers for 11+ minutes — rare for skincare content. The thumbnail A/B tested a shocked expression vs. before/after split; the split won by 34% CTR. YouTube Shorts auto-generated from the 3:20 mark drove an additional 400K views back to the long-form.',
    status: 'pending', stage: 'soul', generatedAt: daysAgo(3),
  },
  {
    id: 'dummy-4', rank: 4, batchId: 'dummy-batch',
    topicHeading: 'SPF 50 vs SPF 100: The Truth Nobody Tells You',
    topic: 'sunscreen SPF comparison',
    platform: 'instagram', contentType: 'image',
    sourceUrl: 'https://www.instagram.com/p/C9pRk7aNeQb/',
    likes: 212000, likesFormatted: '212K',
    views: null, viewsFormatted: null,
    duration: null,
    trendScore: 96,
    whyPopular: 'Myth-busting with a counterintuitive hook ("SPF 100 isn\'t 2× better than SPF 50") creates immediate cognitive dissonance — the primary driver of shares and saves on Instagram. The infographic layout used brand-safe orange/white contrast that stands out in a grid of beige skincare aesthetics. Comment section debates between "knew it!" and "no way" pushed engagement to 4.2% — 3× above beauty niche average.',
    status: 'rejected', stage: 'soul', generatedAt: daysAgo(4),
  },
  {
    id: 'dummy-5', rank: 5, batchId: 'dummy-batch',
    topicHeading: 'My Hyperpigmentation Journey: 6 Months of Azelaic Acid',
    topic: 'hyperpigmentation treatment',
    platform: 'tiktok', contentType: 'video',
    sourceUrl: 'https://www.tiktok.com/@dermdiaries.india/video/7398124056781234688',
    likes: 318000, likesFormatted: '318K',
    views: 2800000, viewsFormatted: '2.8M',
    duration: '4:55',
    trendScore: 97,
    whyPopular: 'Long-form personal journeys on TikTok are outliers that the algorithm rewards heavily when watch-time holds. Monthly side-by-side photos (same angle, same lighting) gave viewers a clear progression payoff. The creator\'s relatability as a South Asian woman treating post-acne marks resonated deeply with an underserved demographic. The duet + stitch count crossed 12K, turning it into a community conversation.',
    status: 'pending', stage: 'nova', generatedAt: daysAgo(5),
  },
  {
    id: 'dummy-6', rank: 6, batchId: 'dummy-batch',
    topicHeading: 'How to Build a Minimal Skincare Routine in 2025 (Only 3 Products)',
    topic: 'minimal skincare routine',
    platform: 'youtube', contentType: 'video',
    sourceUrl: 'https://www.youtube.com/watch?v=xvFZjo5PgG0',
    likes: 74200, likesFormatted: '74.2K',
    views: 890000, viewsFormatted: '890K',
    duration: '8:22',
    trendScore: 88,
    whyPopular: 'Anti-overconsumption content is surging as audiences push back on 12-step routines. Limiting to 3 products removes decision fatigue and speaks to minimalist, sustainability-conscious Gen-Z. The video\'s search-optimised title ("2025" + "only 3 products") captured long-tail YouTube search traffic from people researching before buying. 67% of viewers clicked the Amazon affiliate links in the description.',
    status: 'pending', stage: 'max', generatedAt: daysAgo(6),
  },
  {
    id: 'dummy-7', rank: 7, batchId: 'dummy-batch',
    topicHeading: 'Retinol Ruined My Skin — Here\'s What I Wish I Knew',
    topic: 'retinol mistakes',
    platform: 'twitter_ads', contentType: 'image',
    sourceUrl: 'https://ads.x.com/',
    likes: 56300, likesFormatted: '56.3K',
    views: null, viewsFormatted: null,
    duration: null,
    trendScore: 85,
    whyPopular: 'Paid social creative that leans into a failure-narrative feels more human and less polished, which helps it stop the scroll. The concise headline and strong contrast make it thumb-stopping in-feed, while the educational framing drives clicks from users who are still researching retinol. This format performs well as a top-of-funnel ad because it creates curiosity before the CTA.',
    status: 'pending', stage: 'soul', generatedAt: daysAgo(7),
  },
]

function loadIdeas() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Only reuse stored data if it has batchId (new format)
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].batchId) {
        return parsed.map(normalizeIdea)
      }
    }
    // First load or cleared — seed with dummy data
    localStorage.setItem(LS_KEY, JSON.stringify(DUMMY_IDEAS))
    return DUMMY_IDEAS.map(normalizeIdea)
  } catch {
    return DUMMY_IDEAS.map(normalizeIdea)
  }
}

function saveIdeas(ideas) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(ideas))
  } catch (error) {
    if (import.meta.env.DEV) console.warn('Unable to persist ideas', error)
  }
}

// Realistic-looking mock source URLs per platform
function mockUrl(platform) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const rand = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  const num = () => Math.floor(Math.random() * 9e15 + 1e15)
  switch (platform) {
    case 'instagram': return `https://www.instagram.com/p/${rand(11)}/`
    case 'tiktok':    return `https://www.tiktok.com/@glowskin.official/video/${num()}`
    case 'youtube':   return `https://www.youtube.com/watch?v=${rand(11)}`
    case 'twitter':   return `https://twitter.com/skincarebyX/status/${num()}`
    case 'twitter_ads': return 'https://ads.x.com/'
    default:          return `https://www.instagram.com/p/${rand(11)}/`
  }
}

function randDuration() {
  const m = Math.floor(Math.random() * 4 + 1)
  const s = String(Math.floor(Math.random() * 60)).padStart(2, '0')
  return `${m}:${s}`
}

function randLikes(min, max) {
  return Math.floor(Math.random() * (max - min) + min) * 100
}

function randViews(min, max) {
  return Math.floor(Math.random() * (max - min) + min) * 1000
}

function fmtNum(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

const IDEA_TEMPLATES = [
  {
    topicHeading: '7-Day Glow Challenge',
    platform: 'tiktok',
    contentType: 'video',
    trendScore: 94,
    whyPopular: 'The "before vs after" tension across 7 days keeps viewers returning daily. Each part ends on a cliffhanger showing skin progress, creating a compulsive watch loop. The challenge mechanic also drives UGC duets, multiplying organic reach without any paid spend.',
  },
  {
    topicHeading: 'Ingredient Deep-Dive: Niacinamide',
    platform: 'youtube',
    contentType: 'video',
    trendScore: 88,
    whyPopular: 'Breaking down a single "hero" ingredient with clinical language but approachable delivery positions the creator as an authority. Audiences save this content to reference later — high save-rate signals to YouTube\'s algorithm, pushing it to non-subscribers.',
  },
  {
    topicHeading: 'Skincare Routine Under ₹500',
    platform: 'instagram',
    contentType: 'image',
    trendScore: 97,
    whyPopular: 'Price-anchoring to ₹500 instantly filters in a massive Gen-Z audience feeling priced out of premium skincare. Comments are flooded with "finally, someone did this" reactions — social proof that drives share velocity. The specific rupee figure beats generic "budget skincare" by 3x in engagement.',
  },
  {
    topicHeading: '"GRWM" 8-Min Morning Skincare Routine',
    platform: 'tiktok',
    contentType: 'video',
    trendScore: 91,
    whyPopular: 'GRWM content thrives on parasocial intimacy — the camera follows the creator\'s real morning. The "8 minutes" time-constraint adds scarcity and efficiency appeal. TikTok\'s algorithm heavily promotes this format because watch-through rates are consistently above 80% for GRWM under 10 mins.',
  },
  {
    topicHeading: '5 Skincare Myths Debunked by a Derm',
    platform: 'instagram',
    contentType: 'image',
    trendScore: 85,
    whyPopular: 'Myth-busting creates an instant "I didn\'t know that" dopamine hit, triggering saves. Featuring a dermatologist (real or framed as such) adds credibility that makes the post shareable within friend groups. The numbered format (5 myths) sets clear expectations and drives completion.',
  },
  {
    topicHeading: 'How to Layer Actives: The Correct Order',
    platform: 'twitter_ads',
    contentType: 'image',
    trendScore: 82,
    whyPopular: 'Paid social creative that teaches a universal pain point can outperform a hard sell because it earns attention first and sells second. The vertical infographic layout is easy to scan in the feed, and the strong educational angle gives the ad a native feel that improves click-through over time.',
  },
  {
    topicHeading: 'Sunscreen Showdown: 10 Brands Tested',
    platform: 'youtube',
    contentType: 'video',
    trendScore: 93,
    whyPopular: 'Comparative reviews collapse hours of research into a single watch. The "I spent money so you don\'t have to" framing builds goodwill and positions the creator as a trusted buyer. Brands and commenters naturally argue in comments, boosting engagement metrics which YouTube counts heavily for discovery.',
  },
  {
    topicHeading: 'What Is Your Skin Barrier? (And How To Fix It)',
    platform: 'tiktok',
    contentType: 'video',
    trendScore: 89,
    whyPopular: '"Skin barrier" became a cultural moment in skincare — almost every product now claims to support it. This rides that trend while providing actual education, attracting both trend-curious viewers and skincare veterans. The "how to fix it" half converts interest into actionable saves.',
  },
  {
    topicHeading: 'Beginner Night Routine: 4 Steps Only',
    platform: 'instagram',
    contentType: 'video',
    trendScore: 90,
    whyPopular: 'Limiting the routine to 4 steps removes the overwhelm that keeps beginners from starting skincare at all. The "only" framing is a conversion trigger. Instagram Reels showing real product placement (not haul-style) generate strong click-through to linked products in bio.',
  },
  {
    topicHeading: 'Retinol 101: Start Without Irritation',
    platform: 'youtube',
    contentType: 'video',
    trendScore: 87,
    whyPopular: 'Fear of retinol side-effects (peeling, burning) is the #1 reason people avoid it. This content removes the fear barrier — the moment a viewer overcomes hesitation and purchases, they associate that success with the creator. Builds long-term loyal subscribers who credit the advice.',
  },
]

function generateMockIdeas(config) {
  const topN = config.topN || 5
  const topic = config.topic || 'skincare'
  const chosenPlatforms = config.platforms?.length ? config.platforms : DEFAULT_RESEARCH_PLATFORMS

  // Filter or fall back to all templates
  const filtered = IDEA_TEMPLATES.filter(t => chosenPlatforms.includes(t.platform))
  const pool = filtered.length >= topN ? filtered : IDEA_TEMPLATES
  const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, topN)

  return selected.map((tpl, idx) => {
    const isVideo = tpl.contentType === 'video'
    const likes = randLikes(20, 500)
    const views = isVideo ? randViews(50, 2000) : null
    const duration = isVideo ? randDuration() : null
    const sourceUrl = mockUrl(tpl.platform)

    return {
      id: generateId(),
      rank: idx + 1,
      topicHeading: tpl.topicHeading,
      topic,
      platform: tpl.platform,
      contentType: tpl.contentType,
      sourceUrl,
      likes,
      views,
      duration,
      likesFormatted: fmtNum(likes),
      viewsFormatted: views ? fmtNum(views) : null,
      trendScore: tpl.trendScore,
      whyPopular: tpl.whyPopular,
      status: 'pending', // pending | approved | rejected
      stage: 'soul', // soul | max | nova | published
      generatedAt: new Date().toISOString(),
    }
  })
}

export function useIdeas() {
  const [ideas, setIdeas] = useState(() => loadIdeas())
  const [processing, setProcessing] = useState(false)
  const [view, setView] = useState(ideas.length > 0 ? 'home' : 'scrape')
  const [latestBatchId, setLatestBatchId] = useState(
    () => localStorage.getItem(LS_BATCH_KEY) || 'dummy-batch'
  )

  const runScrapeJob = useCallback((config) => {
    setView('processing')
    setProcessing(true)
    const batchId = `batch-${Date.now()}`
    setTimeout(() => {
      const newIdeas = generateMockIdeas(config).map(idea => ({ ...idea, batchId }))
      setIdeas(prev => {
        const next = [...newIdeas, ...prev].map(normalizeIdea)
        saveIdeas(next)
        return next
      })
      localStorage.setItem(LS_BATCH_KEY, batchId)
      setLatestBatchId(batchId)
      setProcessing(false)
      setView('home')
    }, 3500)
  }, [])

  const approveIdea = useCallback((id) => {
    setIdeas(prev => {
      const next = prev.map(i => i.id === id ? { ...i, status: 'approved', stage: nextStage(i.stage) } : i)
      saveIdeas(next)
      return next
    })
  }, [])

  const rejectIdea = useCallback((id) => {
    setIdeas(prev => {
      const next = prev.map(i => i.id === id ? { ...i, status: 'rejected' } : i)
      saveIdeas(next)
      return next
    })
  }, [])

  const goHome = useCallback(() => { setView('home') }, [])
  const resetToScrape = useCallback(() => { setView('scrape') }, [])

  const clearIdeas = useCallback(() => {
    setIdeas([])
    saveIdeas([])
    setView('scrape')
  }, [])

  const latestIdeas = ideas.filter(i => i.batchId === latestBatchId)

  return {
    ideas, latestIdeas, processing, view,
    runScrapeJob, approveIdea, rejectIdea,
    goHome, resetToScrape, clearIdeas,
  }
}
