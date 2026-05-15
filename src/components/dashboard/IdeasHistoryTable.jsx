import { FileText, Layers3 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const STATUS_META = {
  pending:  { label: 'Pending',  color: 'var(--text-muted)', bg: 'var(--bg-elevated)', border: 'var(--border)' },
  approved: { label: 'Approved', color: '#22c55e',          bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  rejected: { label: 'Rejected', color: '#ef4444',          bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
}

const STAGE_META = {
  soul:      { label: 'Soul',      color: 'var(--soul-color)', bg: 'var(--soul-subtle)', border: 'var(--accent-border)' },
  max:       { label: 'Max',       color: 'var(--max-color)',  bg: 'var(--max-subtle)', border: 'rgba(52,211,153,0.35)' },
  nova:      { label: 'Nova',      color: 'var(--nova-color)', bg: 'var(--nova-subtle)', border: 'rgba(251,191,36,0.35)' },
  published: { label: 'Published', color: '#8b5cf6',           bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)' },
}

function Badge({ label, color, bg, border }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px 10px',
      borderRadius: 999,
      border: `1px solid ${border}`,
      background: bg,
      color,
      fontSize: 12,
      fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

export default function IdeasHistoryTable({ ideas, onNewResearch }) {
  const orderedIdeas = [...ideas].sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
    }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px 24px' }}>
        {orderedIdeas.length === 0 ? (
          <div style={{
            minHeight: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}>
            <div style={{
              maxWidth: 420,
              width: '100%',
              textAlign: 'center',
              padding: 28,
              borderRadius: 18,
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                margin: '0 auto 14px',
                background: 'var(--accent-subtle)',
                border: '1px solid var(--accent-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}>
                <Layers3 size={28} />
              </div>
              <h2 style={{ margin: '0 0 6px', color: 'var(--text-primary)', fontSize: 18 }}>
                No ideas yet
              </h2>
              <p style={{ margin: '0 0 18px', color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>
                Start a new research run and your ideas history will appear here.
              </p>
              <button
                onClick={onNewResearch}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--accent-border)',
                  background: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <FileText size={14} />
                Start Research
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            minWidth: 980,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.16)',
          }}>
            <div style={{
              height: 3,
              background: 'linear-gradient(90deg, var(--accent), rgba(124,106,247,0.2))',
            }} />
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  {['Date', 'Topic', 'Description', 'Status', 'Stage'].map((heading, index) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: 'left',
                        fontSize: 11,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        padding: '14px 16px',
                        borderBottom: '1px solid var(--border)',
                        whiteSpace: 'nowrap',
                        width: [160, 240, 'auto', 140, 140][index],
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orderedIdeas.map((idea, idx) => {
                  const status = STATUS_META[idea.status] || STATUS_META.pending
                  const stage = STAGE_META[idea.stage] || STAGE_META.soul

                  return (
                    <tr
                      key={idea.id}
                      style={{
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)' }}
                    >
                      <td style={{ padding: '16px', verticalAlign: 'top', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                            {formatDate(idea.generatedAt)}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {idea.generatedAt ? new Intl.DateTimeFormat('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            }).format(new Date(idea.generatedAt)) : ''}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '16px', verticalAlign: 'top', minWidth: 240, borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                            {idea.topicHeading}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {idea.topic}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '16px', verticalAlign: 'top', minWidth: 300, borderBottom: '1px solid var(--border)' }}>
                        <p style={{
                          margin: 0,
                          fontSize: 13,
                          color: 'var(--text-secondary)',
                          lineHeight: 1.65,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {idea.whyPopular}
                        </p>
                      </td>

                      <td style={{ padding: '16px', verticalAlign: 'top', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border)' }}>
                        <Badge label={status.label} color={status.color} bg={status.bg} border={status.border} />
                      </td>

                      <td style={{ padding: '16px', verticalAlign: 'top', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border)' }}>
                        <Badge label={stage.label} color={stage.color} bg={stage.bg} border={stage.border} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
