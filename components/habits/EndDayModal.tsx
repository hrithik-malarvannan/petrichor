'use client'
import { useState } from 'react'
import { T, E, COLORS } from '@/lib/constants'
import { NeuBtn, Ring } from '@/components/ui/Neu'
import { isScheduledToday } from '@/lib/utils'
import type { Habit, LogMap, DaySummaryEntry } from '@/lib/types'

const MOODS = ['😩', '😔', '😐', '🙂', '😄']

interface Props {
  habits: Habit[]; logs: LogMap; currentSummary?: DaySummaryEntry
  onSave: (data: { mood: number | null; journal: string }) => Promise<void>; onClose: () => void
}

export default function EndDayModal({ habits, logs, currentSummary, onSave, onClose }: Props) {
  const [mood,    setMood]    = useState<number | null>(currentSummary?.mood ?? null)
  const [journal, setJournal] = useState(currentSummary?.journal ?? '')
  const [saving,  setSaving]  = useState(false)
  const tk    = new Date().toISOString().slice(0, 10)
  const sched = habits.filter(isScheduledToday)
  const done  = sched.filter(h => logs[tk]?.[h.id]?.done)
  const pct   = sched.length ? Math.round(done.length / sched.length * 100) : 0
  const handleSave = async () => { setSaving(true); await onSave({ mood, journal }); setSaving(false) }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'flex-end',
      background: 'rgba(0,0,0,0.8)', animation: `fadeIn .2s ${E} both` }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ width: '100%', borderRadius: '20px 20px 0 0', background: T.surface,
        boxShadow: `${T.shadowOut}, 0 -4px 40px rgba(0,0,0,0.6)`,
        padding: '20px 20px 44px', animation: `slideUp .4s ${E} both`, maxHeight: '92vh', overflowY: 'auto' }}>
        <div style={{ width: 32, height: 3, borderRadius: 2, background: T.border, margin: '0 auto 20px' }}/>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{pct === 100 ? '✦' : pct >= 60 ? '◈' : '◇'}</div>
          <div className="serif" style={{ fontSize: 22, color: T.fg, marginBottom: 4 }}>{pct === 100 ? 'Perfect day' : pct >= 60 ? 'Good effort' : 'Keep going'}</div>
          <div style={{ fontSize: 13, color: T.fgMuted }}>{done.length} of {sched.length} habits</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative', width: 80, height: 80 }}>
            <Ring pct={pct} size={80} stroke={5} done={pct === 100}/>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="serif" style={{ fontSize: 18, color: pct === 100 ? '#7ca885' : T.accent }}>{pct}%</span>
            </div>
          </div>
        </div>
        {sched.map(h => {
          const d = !!logs[tk]?.[h.id]?.done
          const col = COLORS.find(c => c.id === h.color_id) || COLORS[0]
          return (
            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `1px solid ${T.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: d ? col.hex : T.fgDim }}/>
              <span style={{ flex: 1, fontSize: 13, color: d ? T.fg : T.fgDim }}>{h.label}</span>
              <span style={{ fontSize: 14, color: d ? col.hex : T.fgDim }}>{d ? '✓' : '○'}</span>
            </div>
          )
        })}
        <div style={{ marginTop: 20, marginBottom: 8, fontSize: 9, fontWeight: 600, color: T.fgDim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>How do you feel?</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
          {MOODS.map((m, i) => (
            <button key={i} onClick={() => setMood(i)} style={{ width: 42, height: 42, borderRadius: 11, border: 'none', cursor: 'pointer', fontSize: 20,
              background: T.surface, boxShadow: mood === i ? T.shadowIn : T.shadowBtn, transform: mood === i ? 'scale(1.1)' : 'scale(1)', transition: `all .15s ${E}` }}>{m}</button>
          ))}
        </div>
        <div style={{ marginBottom: 8, fontSize: 9, fontWeight: 600, color: T.fgDim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Journal</div>
        <div style={{ background: T.sunken, borderRadius: 12, boxShadow: T.shadowIn, marginBottom: 20 }}>
          <textarea value={journal} onChange={e => setJournal(e.target.value)} placeholder={"Today I...\n\nTomorrow I'll..."} rows={4}
            style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', color: T.fg, fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'none', lineHeight: 1.7 }}/>
        </div>
        <NeuBtn accent onClick={handleSave} style={{ width: '100%', marginBottom: 10 }}>{saving ? 'Saving…' : 'End day & save'}</NeuBtn>
        <NeuBtn onClick={onClose} style={{ width: '100%' }}>Not yet</NeuBtn>
      </div>
    </div>
  )
}
