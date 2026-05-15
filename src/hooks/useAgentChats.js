import { useState, useCallback } from 'react'
import { generateId } from '@/lib/utils'

export const AGENTS = {
  researcher: {
    id: 'researcher',
    name: 'Researcher',
    tagline: 'Content Research Agent',
    description: 'Researches trending ideas across platforms using Apify',
    icon: '🔮',
    colorVar: '--soul-color',
    subtleVar: '--soul-subtle',
    greeting: "Hi, I'm **Researcher** — your content research agent. I scan trending ideas across Instagram, TikTok, YouTube, and more to find what's resonating in the skincare space.\n\nClick **Scrape** to configure a new research job, or just ask me anything.",
  },
  creator: {
    id: 'creator',
    name: 'Creator',
    tagline: 'Content Generation Agent',
    description: 'Generates polished content from researched ideas',
    icon: '✍️',
    colorVar: '--max-color',
    subtleVar: '--max-subtle',
    greeting: "Hey, I'm **Creator** — your content generation agent. Once Researcher hands me a trending idea, I craft captions, scripts, and copy tailored to your brand voice.\n\nShare an idea or paste a reference and I'll get to work.",
  },
  publisher: {
    id: 'publisher',
    name: 'Publisher',
    tagline: 'Publishing Agent',
    description: 'Publishes content across configured platforms via Publer',
    icon: '🚀',
    colorVar: '--nova-color',
    subtleVar: '--nova-subtle',
    greeting: "Hello, I'm **Publisher** — your publishing agent. I'm connected to Publer and will distribute your approved content across all configured social channels.\n\nReady to publish when you are.",
  },
}

function makeGreeting(agentId) {
  const agent = AGENTS[agentId]
  return {
    id: generateId(),
    role: 'agent',
    content: agent.greeting,
    timestamp: new Date(),
    agentId,
  }
}

const initialChats = {
  researcher: [makeGreeting('researcher')],
  creator: [makeGreeting('creator')],
  publisher: [makeGreeting('publisher')],
}

export function useAgentChats() {
  const [activeAgent, setActiveAgent] = useState('researcher')
  const [chats, setChats] = useState(initialChats)
  const [scrapeOpen, setScrapeOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = useCallback((content) => {
    if (!content.trim()) return

    const userMsg = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setChats((prev) => ({
      ...prev,
      [activeAgent]: [...prev[activeAgent], userMsg],
    }))

    // Simulate agent typing response
    setIsTyping(true)
    setTimeout(() => {
      const agentMsg = {
        id: generateId(),
        role: 'agent',
        content: getSimulatedResponse(activeAgent, content),
        timestamp: new Date(),
        agentId: activeAgent,
      }
      setChats((prev) => ({
        ...prev,
        [activeAgent]: [...prev[activeAgent], agentMsg],
      }))
      setIsTyping(false)
    }, 1200 + Math.random() * 800)
  }, [activeAgent])

  const sendScrapeJob = useCallback((config) => {
    const summary = formatScrapeConfig(config)
    const userMsg = {
      id: generateId(),
      role: 'user',
      content: summary,
      timestamp: new Date(),
      isScrapeJob: true,
    }
    setChats((prev) => ({
      ...prev,
      researcher: [...prev.researcher, userMsg],
    }))

    setIsTyping(true)
    setTimeout(() => {
      const agentMsg = {
        id: generateId(),
        role: 'agent',
        content: `Got it! I'm starting the scrape job now. I'll research **${config.topic || 'your topic'}** across **${config.platforms?.join(', ') || 'selected platforms'}**.\n\nLooking for content with at least **${config.minLikes?.toLocaleString() || '1,000'} likes** and **${config.minViews?.toLocaleString() || '5,000'} views**, and I'll surface the top **${config.topN || 5}** ideas for you.\n\n_This may take a few minutes. I'll update you once the results are ready._`,
        timestamp: new Date(),
        agentId: 'researcher',
      }
      setChats((prev) => ({
        ...prev,
        researcher: [...prev.researcher, agentMsg],
      }))
      setIsTyping(false)
    }, 1500)

    setScrapeOpen(false)
  }, [])

  return {
    activeAgent,
    setActiveAgent,
    chats,
    scrapeOpen,
    setScrapeOpen,
    isTyping,
    sendMessage,
    sendScrapeJob,
    messages: chats[activeAgent],
  }
}

function formatScrapeConfig(config) {
  const lines = ['**🔍 New Scrape Job Submitted**\n']
  if (config.topic) lines.push(`**Topic:** ${config.topic}`)
  if (config.hashtags?.length) lines.push(`**Hashtags:** ${config.hashtags.map(h => `#${h}`).join(' ')}`)
  if (config.platforms?.length) lines.push(`**Platforms:** ${config.platforms.join(', ')}`)
  if (config.minLikes) lines.push(`**Min Likes:** ${Number(config.minLikes).toLocaleString()}`)
  if (config.minViews) lines.push(`**Min Views:** ${Number(config.minViews).toLocaleString()}`)
  if (config.topN) lines.push(`**Top N Ideas:** ${config.topN}`)
  return lines.join('\n')
}

function getSimulatedResponse(agentId) {
  const responses = {
    researcher: [
      "I'm scanning the latest trends across your configured platforms. Give me a moment to pull the data.",
      "That's a great angle! Let me research what's performing well in that niche right now.",
      "I'll cross-reference that with Apify's latest data. Want me to prioritize any specific platform?",
      "Looking into it. The skincare space has been buzzing lately — I'll find the top performing ideas.",
    ],
    creator: [
      "Love this direction! Drafting a few caption variations for you now...",
      "Here's a first draft. I can adjust the tone — want something more educational or more lifestyle-focused?",
      "Great input. I'm crafting this with your brand voice in mind. One moment.",
      "I've got a few hooks that could work really well for this. Let me refine them.",
    ],
    publisher: [
      "Ready to schedule! Which platforms should I post this to first?",
      "I've queued this up in Publer. Want to review the schedule before it goes live?",
      "All set. The content is approved and ready for distribution across your connected channels.",
      "I can post immediately or schedule for optimal engagement times. What do you prefer?",
    ],
  }
  const pool = responses[agentId]
  return pool[Math.floor(Math.random() * pool.length)]
}
