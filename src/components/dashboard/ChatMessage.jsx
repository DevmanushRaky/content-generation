import { formatTime } from '@/lib/utils'
import { AGENTS } from '@/hooks/useAgentChats'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const agent = !isUser ? AGENTS[message.agentId] : null

  return (
    <div
      className={`flex gap-3 msg-animate ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser ? (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5"
          style={{ background: agent ? `var(${agent.subtleVar})` : 'var(--bg-elevated)' }}
        >
          {agent?.icon ?? '🤖'}
        </div>
      ) : (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          U
        </div>
      )}

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Name + time */}
        <div className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {isUser ? 'You' : agent?.name ?? 'Agent'}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Content */}
        <div
          className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
          style={
            isUser
              ? {
                  background: 'var(--user-bubble)',
                  color: 'var(--user-bubble-fg)',
                  borderRadius: '18px 18px 4px 18px',
                }
              : {
                  background: 'var(--agent-bubble)',
                  color: 'var(--agent-bubble-fg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '18px 18px 18px 4px',
                }
          }
        >
          {message.isScrapeJob ? (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {message.content}
            </pre>
          ) : (
            <MarkdownContent content={message.content} isUser={isUser} />
          )}
        </div>
      </div>
    </div>
  )
}

function MarkdownContent({ content, isUser }) {
  // Simple markdown-like rendering without extra dep
  const lines = content.split('\n')
  const rendered = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      rendered.push(
        <p key={i} className="font-semibold mb-1">
          {parseInline(line.slice(2, -2))}
        </p>
      )
    } else if (line.trim() === '') {
      rendered.push(<div key={i} className="h-1.5" />)
    } else if (line.startsWith('_') && line.endsWith('_')) {
      rendered.push(
        <p key={i} className="italic opacity-70 text-xs mt-1">
          {line.slice(1, -1)}
        </p>
      )
    } else {
      rendered.push(
        <p key={i} className="leading-relaxed">
          {parseInline(line)}
        </p>
      )
    }
  }

  return <div>{rendered}</div>
}

function parseInline(text) {
  // Parse **bold** inline
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}
