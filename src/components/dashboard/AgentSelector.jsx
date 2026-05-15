import { AGENTS } from '@/hooks/useAgentChats'
import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function AgentSelector({ activeAgent, onSelect }) {
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)
  const agent = AGENTS[activeAgent]

  useEffect(() => {
    function handleClick(e) {
      if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleOpen() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setDropPos({ top: rect.bottom + 8, left: rect.left })
    }
    setOpen(v => !v)
  }

  return (
    <div ref={btnRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        id="agent-selector-btn"
        onClick={handleOpen}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 14px', borderRadius: 12, cursor: 'pointer',
          border: `1px solid ${open ? 'var(--accent-border)' : 'var(--border)'}`,
          background: 'var(--bg-elevated)',
          boxShadow: open ? '0 0 0 3px var(--accent-subtle)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: `var(${agent.colorVar})`, flexShrink: 0 }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: `var(${agent.colorVar})` }}>{agent.name}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>·</span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{agent.tagline}</span>
        <ChevronDown size={13} style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', marginLeft: 2, flexShrink: 0 }} />
      </button>

      {open && (
        <div
          className="panel-animate"
          style={{
            position: 'fixed', zIndex: 9999,
            top: dropPos.top, left: dropPos.left,
            minWidth: 300, borderRadius: 14, overflow: 'hidden',
            border: '1px solid var(--border)', background: 'var(--bg-elevated)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
          }}
        >
          {Object.values(AGENTS).map(a => (
            <button
              key={a.id}
              onClick={() => { onSelect(a.id); setOpen(false) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: activeAgent === a.id ? 'var(--accent-subtle)' : 'transparent',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { if (activeAgent !== a.id) e.currentTarget.style.background = 'var(--bg-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.background = activeAgent === a.id ? 'var(--accent-subtle)' : 'transparent' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: `var(${a.subtleVar})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                {a.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: `var(${a.colorVar})` }}>{a.name}</span>
                  {activeAgent === a.id && (
                    <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 99, background: 'var(--accent-subtle)', color: 'var(--accent)', fontWeight: 500 }}>Active</span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>{a.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
