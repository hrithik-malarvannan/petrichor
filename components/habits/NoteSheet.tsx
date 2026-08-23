'use client'
import { useState } from 'react'
import { T, E, COLORS } from '@/lib/constants'
import { NeuBtn } from '@/components/ui/Neu'
import type { Habit } from '@/lib/types'

interface Props {
  habit: Habit; currentNote: string
  onSave: (note: string) => Promise<void>; onClose: () => void
}

export default function NoteSheet({ habit, currentNote, onSave, onClose }: Props) {
  const [note, setNote] = useState(currentNote)
  const [saving, setSaving] = useState(false)
  const col = COLORS.find(c => c.id === habit.color_id) || COLORS[0]

  const handleSave = async () => { setSaving(true); await onSave(note); setSaving(false) }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'flex-end',
      background: 'rgba(0,0,0,0.8)', animation: `fadeIn .2s ${E} both` }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ width: '100%', borderRadius: '20px 20px 0 0', background: T.surface,
        boxShadow: `${T.shadowOut}, 0 -4px 40px rgba(0,0,0,0.6)`,
        padding: '20px 20px 44px', animation: `slideUp .35s ${E} both` }}>
        <div style={{ width: 32, height: 3, borderRadius: 2, background: T.border, margin: '0 auto 20px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.hex, boxShadow: `0 0 6px ${col.hex}88` }}/>
          <span className="serif" style={{ fontSize: 16, color: T.fg }}>{habit.label}</span>
        </div>
        <div style={{ background: T.sunken, borderRadius: 12, boxShadow: T.shadowIn, marginBottom: 16 }}>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="How did it go today?" rows={4}
            style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none',
              color: T.fg, fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'none', lineHeight: 1.7 }}/>
        </div>
        <NeuBtn onClick={handleSave} accent style={{ width: '100%', marginBottom: 10 }}>{saving ? 'Saving…' : 'Save note'}</NeuBtn>
        <NeuBtn onClick={onClose} style={{ width: '100%' }}>Cancel</NeuBtn>
      </div>
    </div>
  )
}
