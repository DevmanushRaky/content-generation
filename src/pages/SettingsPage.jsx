import { useEnvVars } from '@/hooks/useEnvVars'
import { EnvVarRow, EditEnvVarRow, AddEnvVarRow } from '@/components/settings/EnvVarRow'
import { Plus, ShieldCheck, KeyRound, Menu } from 'lucide-react'

function EmptyState() {
  return (
    <tr>
      <td colSpan={3}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '80px 24px' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KeyRound size={22} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>No environment variables</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Add your API keys and secrets using the button above.</p>
          </div>
        </div>
      </td>
    </tr>
  )
}

export default function SettingsPage({ onMenuOpen, isMobile }) {
  const {
    vars, editing, setEditing, adding, setAdding,
    revealed, deleteConfirm, setDeleteConfirm,
    addVar, updateVar, deleteVar, toggleReveal,
  } = useEnvVars()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: 'var(--bg-primary)' }}>
      {/* ── Page header ── */}
      <div style={{ padding: '20px clamp(16px, 3vw, 40px) 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            {isMobile && (
              <button onClick={onMenuOpen} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary)', padding: 6, borderRadius: 8,
                display: 'flex', alignItems: 'center', flexShrink: 0,
              }}>
                <Menu size={20} />
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <h1 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap' }}>
                Environment Variables
              </h1>
            </div>
          </div>

          <button
            id="add-env-var-btn"
            onClick={() => { setAdding(true); setEditing(null) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 12, border: 'none',
              background: 'var(--accent)', color: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            <Plus size={15} />
            Add Variable
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, padding: 'clamp(20px, 3vw, 32px) clamp(16px, 3vw, 40px)' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          {/* Info banner */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 18px', borderRadius: 12, marginBottom: 24,
            background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
          }}>
            <ShieldCheck size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Variables are stored locally in app state. In production, connect your secrets manager.{' '}
              <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Values are never logged or transmitted.</span>
            </span>
          </div>

          {/* Table card */}
          <div style={{ borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-card)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                  {['Key', 'Value', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '16px 24px',
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        width: i === 0 ? '35%' : i === 2 ? '190px' : undefined,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adding && (
                  <AddEnvVarRow onAdd={addVar} onCancel={() => setAdding(false)} />
                )}

                {vars.length === 0 && !adding ? (
                  <EmptyState />
                ) : (
                  vars.map((v, i) =>
                    editing === v.id ? (
                      <EditEnvVarRow
                        key={v.id}
                        envVar={v}
                        onSave={updateVar}
                        onCancel={() => setEditing(null)}
                      />
                    ) : (
                      <tr
                        key={v.id}
                        className="group"
                        style={{
                          borderTop: (i > 0 || adding) ? '1px solid var(--border-subtle)' : 'none',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <EnvVarRow
                          envVar={v}
                          revealed={revealed}
                          onReveal={toggleReveal}
                          onEdit={setEditing}
                          onDelete={deleteVar}
                          deleteConfirm={deleteConfirm}
                          setDeleteConfirm={setDeleteConfirm}
                        />
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14 }}>
            {vars.length} variable{vars.length !== 1 ? 's' : ''} configured · Hover a row to reveal actions
          </p>
        </div>
      </div>
    </div>
  )
}
