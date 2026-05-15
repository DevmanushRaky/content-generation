import { useState } from 'react'
import { Search, Hash, Globe, Heart, Eye, Lightbulb, X, ArrowRight } from 'lucide-react'
import { PLATFORMS } from './platforms'

function SectionLabel({ icon: Icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
      <Icon size={13} style={{ color: 'var(--text-muted)' }} />
      <span style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--text-muted)',
      }}>
        {label}
      </span>
    </div>
  )
}

const baseInput = {
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

const focusIn = e => {
  e.target.style.borderColor = 'var(--accent-border)'
  e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)'
}
const focusOut = e => {
  e.target.style.borderColor = 'var(--border)'
  e.target.style.boxShadow = 'none'
}

function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('')

  function addTag(val) {
    const clean = val.replace(/^#/, '').trim()
    if (clean && !tags.includes(clean)) onChange([...tags, clean])
    setInput('')
  }

  return (
    <div
      style={{
        display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 46,
        background: 'var(--bg-primary)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '8px 12px', cursor: 'text',
        alignItems: 'center', boxSizing: 'border-box',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onClick={e => e.currentTarget.querySelector('input')?.focus()}
    >
      {tags.map(tag => (
        <span key={tag} style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 12, padding: '3px 8px', borderRadius: 6, fontWeight: 500,
          background: 'var(--accent-subtle)', color: 'var(--accent)',
          border: '1px solid var(--accent-border)',
        }}>
          #{tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter(t => t !== tag))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex', opacity: 0.7 }}
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input) }
          if (e.key === 'Backspace' && !input && tags.length) onChange(tags.slice(0, -1))
        }}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? 'skincare, glow… press Enter' : ''}
        style={{
          flex: 1, minWidth: 80, background: 'transparent', border: 'none',
          outline: 'none', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'inherit',
        }}
      />
    </div>
  )
}

export default function ScrapePanel({ onSubmit, onBack }) {
  const [form, setForm] = useState({
    topic: '', hashtags: [], platforms: [], minLikes: '', minViews: '', topN: 5,
  })
  const [errors, setErrors] = useState({})

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }))
  }

  function togglePlatform(id) {
    set('platforms', form.platforms.includes(id)
      ? form.platforms.filter(p => p !== id)
      : [...form.platforms, id]
    )
  }

  function validate() {
    const e = {}
    if (!form.topic.trim()) e.topic = 'Topic is required'
    if (!form.platforms.length) e.platforms = 'Select at least one platform'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (validate()) onSubmit({ ...form, topN: Number(form.topN) || 5 })
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

      {/* ── Page header ── */}
      <div style={{
        padding: '0 20px', height: 64, minHeight: 64,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        {/* Back button */}
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
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Dashboard
        </button>

        <div style={{ width: 1, height: 22, background: 'var(--border)' }} />

        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            New Research Job
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, marginTop: 1 }}>
            Configure a research job and Researcher will surface trending content ideas
          </p>
        </div>
      </div>

      {/* ── Scrollable form body ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px 40px',
      }}>
        <div style={{
          maxWidth: 760,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}>

          {/* Topic */}
          <div>
            <SectionLabel icon={Search} label="Topic / Description" />
            <textarea
              value={form.topic}
              onChange={e => set('topic', e.target.value)}
              placeholder="e.g. Trending skincare routines for dry skin in 2025"
              rows={3}
              style={{ ...baseInput, resize: 'none', lineHeight: 1.6 }}
              onFocus={focusIn} onBlur={focusOut}
            />
            {errors.topic && <p style={{ color: 'var(--destructive)', fontSize: 12, marginTop: 6 }}>{errors.topic}</p>}
          </div>

          {/* Hashtags */}
          <div>
            <SectionLabel icon={Hash} label="Hashtags (optional)" />
            <TagInput tags={form.hashtags} onChange={v => set('hashtags', v)} />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Press Enter or comma to add a tag</p>
          </div>

          {/* Platforms */}
          <div>
            <SectionLabel icon={Globe} label="Platforms to Research" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
              {PLATFORMS.map(p => {
                const active = form.platforms.includes(p.id)
                const PlatformIcon = p.Icon
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                      border: active ? '1px solid var(--accent-border)' : '1px solid var(--border)',
                      background: active ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                      color: active ? 'var(--accent)' : 'var(--text-secondary)',
                      fontSize: 13, fontWeight: 500, textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <PlatformIcon size={16} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.label}</span>
                    {active && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="7" fill="var(--accent)" />
                        <path d="M4 7l2.1 2.1L10 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
            {errors.platforms && <p style={{ color: 'var(--destructive)', fontSize: 12, marginTop: 8 }}>{errors.platforms}</p>}
          </div>

          {/* Min Likes & Views */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <SectionLabel icon={Heart} label="Min Likes (optional)" />
              <input
                type="number"
                value={form.minLikes}
                onChange={e => set('minLikes', e.target.value)}
                placeholder="e.g. 5000"
                min={0} step={1000}
                style={baseInput}
                onFocus={focusIn} onBlur={focusOut}
              />
            </div>
            <div>
              <SectionLabel icon={Eye} label="Min Views (optional)" />
              <input
                type="number"
                value={form.minViews}
                onChange={e => set('minViews', e.target.value)}
                placeholder="e.g. 20000"
                min={0} step={5000}
                style={baseInput}
                onFocus={focusIn} onBlur={focusOut}
              />
            </div>
          </div>

          {/* Top N */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <SectionLabel icon={Lightbulb} label="How many ideas?" />
              <span style={{
                fontSize: 14, fontWeight: 700, padding: '3px 10px', borderRadius: 8,
                background: 'var(--accent-subtle)', color: 'var(--accent)',
              }}>
                {form.topN} ideas
              </span>
            </div>
            <input
              type="range" min={1} max={20} value={form.topN}
              onChange={e => set('topN', Number(e.target.value))}
              style={{
                width: '100%', height: 6, borderRadius: 99, cursor: 'pointer',
                accentColor: 'var(--accent)',
                background: `linear-gradient(to right, var(--accent) ${(form.topN - 1) / 19 * 100}%, var(--border) ${(form.topN - 1) / 19 * 100}%)`,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>1</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>20</span>
            </div>
          </div>

          {/* Submit */}
          <button
            id="submit-scrape-job"
            type="button"
            onClick={handleSubmit}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '15px 28px', borderRadius: 14, border: 'none',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
              color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              letterSpacing: '-0.01em',
              boxShadow: '0 4px 24px rgba(124,106,247,0.35)',
              transition: 'opacity 0.15s, transform 0.15s, box-shadow 0.15s',
              marginTop: 8,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,106,247,0.45)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,106,247,0.35)'
            }}
          >
            Generate Ideas with Researcher
            <ArrowRight size={16} />
          </button>

        </div>
      </div>
    </div>
  )
}
