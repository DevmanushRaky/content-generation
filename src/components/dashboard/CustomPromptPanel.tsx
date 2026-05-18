import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowLeft, FileImage, Film, Minus, Plus, Upload, X } from 'lucide-react'
import type { CustomPromptInput, PromptReference } from '@/hooks/useMax'

type CustomPromptPanelProps = {
  onSubmit: (_form: CustomPromptInput) => void
  onBack: () => void
}

type PromptForm = {
  description: string
  aspectRatio: string
  audio: boolean
  negativePrompt: string
  references: PromptReference[]
}

const baseInput: CSSProperties = {
  width: '100%',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '11px 14px',
  fontSize: 14,
  color: 'var(--text-primary)',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxSizing: 'border-box',
}

function SectionLabel({ icon: Icon, label, note }: { icon: any; label: string; note?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={13} style={{ color: 'var(--text-muted)' }} />
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--text-muted)',
        }}>
          {label}
        </span>
      </div>
      {note && (
        <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', lineHeight: 1.4 }}>
          {note}
        </span>
      )}
    </div>
  )
}

function focusIn(e) {
  e.target.style.borderColor = 'var(--accent-border)'
  e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)'
}

function focusOut(e) {
  e.target.style.borderColor = 'var(--border)'
  e.target.style.boxShadow = 'none'
}

function formatSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 102.4) / 10} KB`
  return `${Math.round((size / 1024 / 1024) * 10) / 10} MB`
}

function PromptChip({ refItem, onRemove }: { refItem: PromptReference; onRemove: (_id: string) => void }) {
  const isVideo = refItem.kind === 'video'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px', borderRadius: 12,
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isVideo ? 'rgba(96,165,250,0.1)' : 'var(--accent-subtle)',
        color: isVideo ? '#60a5fa' : 'var(--accent)',
        flexShrink: 0,
      }}>
        {isVideo ? <Film size={15} /> : <FileImage size={15} />}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {refItem.name}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>
          {refItem.kind.toUpperCase()} · {formatSize(refItem.size)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(refItem.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          display: 'flex',
          padding: 4,
          borderRadius: 6,
        }}
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default function CustomPromptPanel({ onSubmit, onBack }: CustomPromptPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<PromptForm>({
    description: '',
    aspectRatio: '16:9',
    audio: false,
    negativePrompt: '',
    references: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set<K extends keyof PromptForm>(key: K, value: PromptForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate() {
    const nextErrors: Record<string, string> = {}
    if (!form.description.trim()) nextErrors.description = 'Prompt description is required'
    if (!form.aspectRatio.trim()) nextErrors.aspectRatio = 'Aspect ratio is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleFileSelect(files: FileList | null) {
    if (!files?.length) return
    const next = Array.from(files).map(file => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      kind: file.type.startsWith('video/') ? 'video' : 'image',
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
    } as PromptReference))

    setForm(prev => {
      const merged = [...prev.references]
      for (const item of next) {
        if (!merged.some(existing => existing.id === item.id)) merged.push(item)
      }
      return { ...prev, references: merged }
    })

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleSubmit() {
    if (!validate()) return
    onSubmit({
      description: form.description.trim(),
      aspectRatio: form.aspectRatio,
      audio: form.audio,
      negativePrompt: form.negativePrompt.trim(),
      contentType: 'video',
      references: form.references,
    })
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        padding: '0 20px', height: 64, minHeight: 64,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 13, fontWeight: 500,
            padding: '6px 4px', borderRadius: 8, transition: 'color 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={15} />
          Creator
        </button>

        <div style={{ width: 1, height: 22, background: 'var(--border)' }} />

        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            New Prompt Job
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, marginTop: 1 }}>
            Write a custom generation brief and attach supporting references
          </p>
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px 40px',
      }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}>
          <div>
            <SectionLabel icon={Upload} label="Prompt Description" note="Describe the shot, tone, pacing, and subject" />
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Write the prompt you want Creator to use..."
              rows={5}
              style={{ ...baseInput, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={focusIn}
              onBlur={focusOut}
            />
            {errors.description && <p style={{ color: 'var(--destructive)', fontSize: 12, marginTop: 6 }}>{errors.description}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
            <div>
              <SectionLabel icon={Plus} label="Aspect Ratio" note="Choose the output framing" />
              <select
                value={form.aspectRatio}
                onChange={e => set('aspectRatio', e.target.value)}
                style={baseInput}
                onFocus={focusIn}
                onBlur={focusOut}
              >
                <option value="1:1">1:1 - Square</option>
                <option value="4:5">4:5 - Portrait feed</option>
                <option value="9:16">9:16 - Vertical video</option>
                <option value="16:9">16:9 - Landscape</option>
                <option value="3:4">3:4 - Tall portrait</option>
              </select>
              {errors.aspectRatio && <p style={{ color: 'var(--destructive)', fontSize: 12, marginTop: 6 }}>{errors.aspectRatio}</p>}
            </div>
            <div>
              <SectionLabel icon={AudioIcon} label="Audio" note="Include sound in the final video" />
              <button
                type="button"
                onClick={() => set('audio', !form.audio)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  justifyContent: 'space-between',
                  fontSize: 14,
                }}
              >
                <span>Audio {form.audio ? 'enabled' : 'disabled'}</span>
                <span style={{
                  width: 42, height: 24, borderRadius: 99,
                  background: form.audio ? 'var(--accent)' : 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  flexShrink: 0,
                }}>
                  <span style={{
                    position: 'absolute',
                    top: 2,
                    left: form.audio ? 20 : 2,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.15s',
                  }} />
                </span>
              </button>
              {errors.audio && <p style={{ color: 'var(--destructive)', fontSize: 12, marginTop: 6 }}>{errors.audio}</p>}
            </div>
          </div>

          <div>
            <SectionLabel icon={Minus} label="Negative Prompts" note="What should the model avoid?" />
            <textarea
              value={form.negativePrompt}
              onChange={e => set('negativePrompt', e.target.value)}
              placeholder="e.g. blurry hands, extra fingers, cluttered background, low contrast..."
              rows={4}
              style={{ ...baseInput, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>

          <div>
            <SectionLabel
              icon={Upload}
              label="References"
              note="Attach any number of images or videos. Video refs will be used when the selected model supports them."
            />
            <div style={{
              border: '1px dashed var(--border)',
              borderRadius: 14,
              background: 'var(--bg-secondary)',
              padding: 14,
            }}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={e => handleFileSelect(e.target.files)}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Upload size={14} />
                Add references
              </button>

              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '10px 0 0', lineHeight: 1.6 }}>
                You can add multiple images and videos. Reference files are stored as metadata in this demo flow.
              </p>

              {form.references.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginTop: 14 }}>
                  {form.references.map(refItem => (
                    <PromptChip key={refItem.id} refItem={refItem} onRemove={id => set('references', form.references.filter(item => item.id !== id))} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            paddingTop: 2,
          }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                padding: '11px 18px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                padding: '11px 18px',
                borderRadius: 12,
                border: 'none',
                background: 'var(--max-color)',
                color: '#000',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Create Prompt Job
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AudioIcon(props: any) {
  return (
    <svg width={props.size ?? 13} height={props.size ?? 13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v18" />
      <path d="M5 8v8" />
      <path d="M19 8v8" />
      <path d="M8 6v12" />
      <path d="M16 6v12" />
    </svg>
  )
}
