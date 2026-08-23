'use client'
import { useMemo, useState } from 'react'
import { T } from '@/lib/constants'
import { useHabits } from '@/hooks/useHabits'
import { useLogs } from '@/hooks/useLogs'
import { daysAgo } from '@/lib/utils'

const MOODS = ['😩', '😔', '😐', '🙂', '😄']

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ flex: 1, background: T.surface, borderRadius: 14, boxShadow: T.shadowOut, padding: '14px 12px', textAlign: 'center' }}>
      <div className="serif" style={{ fontSize: 20, color: T.accent, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 9, color: T.fgDim, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

export default function ReportsPage() {
  const { habits, loading: hLoading } = useHabits()
  const { logs, summaries, loading: lLoading } = useLogs()
  const [range, setRange] = useState<7 | 30>(7)

  const stats = useMemo(() => {
    const days = Array.from({ length: range }, (_, i) => daysAgo(range - 1 - i))
    let scheduled = 0, done = 0
    days.forEach(d => {
      const dow = new Date(d + 'T12:00:00').getDay()
      habits.forEach(h => {
        const sched = !h.schedule_days || h.schedule_days.includes(dow)
        if (sched) { scheduled++; if (logs[d]?.[h.id]?.done) done++ }
      })
    })
    const moodDays = days.filter(d => typeof summaries[d]?.mood === 'number')
    const avgMood = moodDays.length ? moodDays.reduce((s, d) => s + (summaries[d].mood as number), 0) / moodDays.length : null
    return { days, scheduled, done, rate: scheduled ? Math.round((done / scheduled) * 100) : 0, avgMood }
  }, [habits, logs, summaries, range])

  if (hLoading || lLoading) return null

  return (
    <div style={{ padding: '32px 20px 120px', minHeight: '100vh', background: T.bg }}>
      <h1 className="serif" style={{ fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: T.fg, margin: '0 0 18px', letterSpacing: '-0.02em' }}>Reports</h1>

      <div style={{ display: 'flex', gap: 7, marginBottom: 18 }}>
        {([7, 30] as const).map(r => (
          <button key={r} onClick={() => setRange(r)} style={{
            padding: '6px 14px', borderRadius: 99, fontFamily: 'inherit',
            border: `1px solid ${range === r ? T.accent + '55' : T.border}`,
            background: range === r ? `${T.accent}10` : T.surface,
            boxShadow: range === r ? T.shadowSm : T.shadowBtn,
            color: range === r ? T.accent : T.fgMuted, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            {r === 7 ? 'Week' : 'Month'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <StatCard label="Completed" value={stats.done} />
        <StatCard label="Completion" value={`${stats.rate}%`} />
        <StatCard label="Avg mood" value={stats.avgMood !== null ? MOODS[Math.round(stats.avgMood)] : '—'} />
      </div>

      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: T.fgDim, textTransform: 'uppercase', marginBottom: 10 }}>Daily journal</div>
      {stats.days.slice().reverse().filter(d => summaries[d]?.journal).map(d => (
        <div key={d} style={{ background: T.surface, borderRadius: 12, boxShadow: T.shadowOut, padding: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: T.fgDim }}>{d}</span>
            {typeof summaries[d]?.mood === 'number' && <span style={{ fontSize: 14 }}>{MOODS[summaries[d].mood as number]}</span>}
          </div>
          <div style={{ fontSize: 12, color: T.fgMuted, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{summaries[d].journal}</div>
        </div>
      ))}
      {stats.days.every(d => !summaries[d]?.journal) && <div style={{ fontSize: 12, color: T.fgDim }}>No journal entries in this range yet.</div>}
    </div>
  )
}
