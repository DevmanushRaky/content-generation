import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

export default function ChatInput({ onSend, disabled, placeholder, isMobile }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [value])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const canSend = !!value.trim() && !disabled

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      padding: isMobile ? '12px 16px 16px' : '16px 40px 20px',
      flexShrink: 0,
    }}>
      {/* Inner column matches chat message column */}
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex', alignItems: 'flex-end', gap: 10,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 16, padding: '12px 14px',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocusCapture={e => {
            e.currentTarget.style.borderColor = 'var(--accent-border)'
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-subtle)'
          }}
          onBlurCapture={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <textarea
            ref={textareaRef}
            id="chat-input"
            rows={1}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? 'Message the agent…'}
            disabled={disabled}
            style={{
              flex: 1, resize: 'none', background: 'transparent', border: 'none',
              outline: 'none', fontSize: 14, lineHeight: '1.6',
              color: 'var(--text-primary)', minHeight: 24, maxHeight: 160,
              fontFamily: 'inherit', padding: 0,
            }}
          />
          <button
            id="send-message-btn"
            onClick={handleSend}
            disabled={!canSend}
            style={{
              width: 36, height: 36, borderRadius: 10, border: 'none',
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: canSend ? 'pointer' : 'not-allowed',
              background: canSend ? 'var(--accent)' : 'var(--bg-elevated)',
              color: canSend ? '#fff' : 'var(--text-muted)',
              transition: 'background 0.15s',
            }}
          >
            <Send size={14} />
          </button>
        </div>

        <p style={{ fontSize: 11, textAlign: 'center', marginTop: 8, color: 'var(--text-muted)' }}>
          Press{' '}
          <kbd style={{ padding: '1px 5px', borderRadius: 4, fontSize: 11, fontFamily: 'monospace', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Enter</kbd>
          {' '}to send,{' '}
          <kbd style={{ padding: '1px 5px', borderRadius: 4, fontSize: 11, fontFamily: 'monospace', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Shift+Enter</kbd>
          {' '}for new line
        </p>
      </div>
    </div>
  )
}
