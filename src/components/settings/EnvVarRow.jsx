import { useState } from 'react'
import { Eye, EyeOff, Edit2, Trash2, Check, X } from 'lucide-react'

const cellPad = { padding: '14px 20px' }
const inputStyle = {
  width: '100%',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  fontFamily: 'monospace',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

function StyledInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
      onFocus={e => {
        e.target.style.borderColor = 'var(--accent-border)'
        e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)'
      }}
      onBlur={e => {
        e.target.style.borderColor = 'var(--border)'
        e.target.style.boxShadow = 'none'
      }}
    />
  )
}

function ActionBtn({ onClick, title, children, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 28, height: 28, borderRadius: 6, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', background: 'transparent',
        color: 'var(--text-muted)', transition: 'background 0.12s, color 0.12s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = danger ? 'var(--destructive-subtle)' : 'var(--bg-elevated)'
        e.currentTarget.style.color = danger ? 'var(--destructive)' : 'var(--text-primary)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = 'var(--text-muted)'
      }}
    >
      {children}
    </button>
  )
}

// ── Add Row ───────────────────────────────────────────────────────────────────
export function AddEnvVarRow({ onAdd, onCancel }) {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')

  return (
    <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--accent-subtle)' }}>
      <td style={cellPad}><StyledInput value={key} onChange={setKey} placeholder="KEY_NAME" /></td>
      <td style={cellPad}><StyledInput value={value} onChange={setValue} placeholder="value" /></td>
      <td style={cellPad}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => key.trim() && onAdd(key.trim(), value)}
            style={{
              width: 30, height: 30, borderRadius: 8, border: 'none',
              background: 'var(--accent)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="Save"
          >
            <Check size={14} />
          </button>
          <button
            onClick={onCancel}
            style={{
              width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--bg-elevated)', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="Cancel"
          >
            <X size={14} />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── Edit Row ──────────────────────────────────────────────────────────────────
export function EditEnvVarRow({ envVar, onSave, onCancel }) {
  const [key, setKey] = useState(envVar.key)
  const [value, setValue] = useState(envVar.value)

  return (
    <tr style={{ background: 'var(--accent-subtle)', borderTop: '1px solid var(--border-subtle)' }}>
      <td style={cellPad}><StyledInput value={key} onChange={setKey} placeholder="KEY_NAME" /></td>
      <td style={cellPad}><StyledInput value={value} onChange={setValue} placeholder="value" /></td>
      <td style={cellPad}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onSave(envVar.id, key, value)}
            style={{
              width: 30, height: 30, borderRadius: 8, border: 'none',
              background: 'var(--accent)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="Save changes"
          >
            <Check size={14} />
          </button>
          <button
            onClick={onCancel}
            style={{
              width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--bg-elevated)', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="Cancel"
          >
            <X size={14} />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── Display Row ───────────────────────────────────────────────────────────────
export function EnvVarRow({ envVar, revealed, onReveal, onEdit, onDelete, deleteConfirm, setDeleteConfirm }) {
  const isDeleteConfirm = deleteConfirm === envVar.id
  const isRevealed = revealed.has(envVar.id)
  const displayValue = isRevealed ? envVar.value : '•'.repeat(Math.min(envVar.value.length, 28))

  return (
    <>
      {/* Key */}
      <td style={cellPad}>
        <span style={{
          fontFamily: 'monospace', fontSize: 13,
          padding: '3px 8px', borderRadius: 6,
          background: 'var(--accent-subtle)', color: 'var(--accent)',
          fontWeight: 500,
        }}>
          {envVar.key}
        </span>
      </td>

      {/* Value */}
      <td style={cellPad}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <code style={{
            fontFamily: 'monospace', fontSize: 13,
            color: isRevealed ? 'var(--text-primary)' : 'var(--text-muted)',
            letterSpacing: isRevealed ? 'normal' : '0.08em',
          }}>
            {displayValue}
          </code>
          <button
            onClick={() => onReveal(envVar.id)}
            title={isRevealed ? 'Hide value' : 'Reveal value'}
            className="group-hover-show"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: 2,
              opacity: 0, transition: 'opacity 0.15s',
              display: 'flex', alignItems: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
      </td>

      {/* Actions */}
      <td style={cellPad}>
        {isDeleteConfirm ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Delete?</span>
            <button
              onClick={() => onDelete(envVar.id)}
              style={{
                fontSize: 12, padding: '3px 10px', borderRadius: 6,
                border: 'none', cursor: 'pointer', fontWeight: 500,
                background: 'var(--destructive-subtle)', color: 'var(--destructive)',
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              style={{
                fontSize: 12, padding: '3px 10px', borderRadius: 6,
                border: '1px solid var(--border)', cursor: 'pointer',
                background: 'var(--bg-elevated)', color: 'var(--text-muted)',
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div
            className="row-actions"
            style={{ display: 'flex', gap: 4, opacity: 0, transition: 'opacity 0.15s' }}
          >
            <ActionBtn onClick={() => onEdit(envVar.id)} title="Edit">
              <Edit2 size={13} />
            </ActionBtn>
            <ActionBtn onClick={() => setDeleteConfirm(envVar.id)} title="Delete" danger>
              <Trash2 size={13} />
            </ActionBtn>
          </div>
        )}
      </td>
    </>
  )
}
