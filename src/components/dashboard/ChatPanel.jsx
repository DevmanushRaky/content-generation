import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { AGENTS } from '@/hooks/useAgentChats'

function TypingIndicator({ agent }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: `var(${agent.subtleVar})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, marginTop: 2 }}>
        {agent.icon}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
        background: 'var(--agent-bubble)', border: '1px solid var(--border-subtle)',
      }}>
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  )
}

function EmptyState({ agent }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '60px 32px 120px' }}>
      <div style={{ width: 72, height: 72, borderRadius: 22, background: `var(${agent.subtleVar})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
        {agent.icon}
      </div>
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>Chat with {agent.name}</h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{agent.description}. Start a conversation below.</p>
      </div>
    </div>
  )
}

export default function ChatPanel({ activeAgent, messages, isTyping, onSend, isMobile }) {
  const agent = AGENTS[activeAgent]
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const placeholder = {
    soul: 'Ask Soul to research trends, compare platforms…',
    max: 'Ask Max to write a caption, draft a script…',
    nova: 'Ask Nova to schedule or publish content…',
  }[activeAgent]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflow: 'hidden', minWidth: 0 }}>
      {/* Messages scroll area */}
      <div id="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '32px 0 16px' }}>
        {messages.length === 0 ? (
          <EmptyState agent={agent} />
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 20,
            maxWidth: 720, margin: '0 auto',
            padding: isMobile ? '0 16px' : '0 40px',
          }}>
            {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
          </div>
        )}
        {isTyping && (
          <div style={{ maxWidth: 720, margin: '12px auto 0', padding: isMobile ? '0 16px' : '0 40px' }}>
            <TypingIndicator agent={agent} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Chat input */}
      <ChatInput onSend={onSend} disabled={isTyping} placeholder={placeholder} isMobile={isMobile} />
    </div>
  )
}
