import { useState, useCallback } from 'react'
import { generateId } from '@/lib/utils'

const INITIAL_VARS = [
  { id: generateId(), key: 'OPENCLAW_API_KEY', value: 'sk-oc-••••••••••••••••••••••', masked: true },
  { id: generateId(), key: 'APIFY_TOKEN', value: 'apfy_••••••••••••••••••••••••••', masked: true },
  { id: generateId(), key: 'PUBLER_API_KEY', value: 'pub_••••••••••••••••••••••••••', masked: true },
  { id: generateId(), key: 'OPENAI_API_KEY', value: 'sk-••••••••••••••••••••••••••••••', masked: true },
]

export function useEnvVars() {
  const [vars, setVars] = useState(INITIAL_VARS)
  const [editing, setEditing] = useState(null) // id of var being edited
  const [adding, setAdding] = useState(false)
  const [revealed, setRevealed] = useState(new Set())
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const addVar = useCallback((key, value) => {
    if (!key.trim()) return
    setVars((prev) => [...prev, { id: generateId(), key: key.trim(), value, masked: false }])
    setAdding(false)
  }, [])

  const updateVar = useCallback((id, key, value) => {
    setVars((prev) =>
      prev.map((v) => (v.id === id ? { ...v, key: key.trim(), value } : v))
    )
    setEditing(null)
  }, [])

  const deleteVar = useCallback((id) => {
    setVars((prev) => prev.filter((v) => v.id !== id))
    setDeleteConfirm(null)
  }, [])

  const toggleReveal = useCallback((id) => {
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return {
    vars,
    editing,
    setEditing,
    adding,
    setAdding,
    revealed,
    deleteConfirm,
    setDeleteConfirm,
    addVar,
    updateVar,
    deleteVar,
    toggleReveal,
  }
}
