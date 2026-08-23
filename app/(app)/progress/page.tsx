'use client'
import { T, COLORS } from '@/lib/constants'
import { useHabits } from '@/hooks/useHabits'
import { useLogs } from '@/hooks/useLogs'
import { daysAgo, streak } from '@/lib/utils'
import type { Habit, LogMap } from '@/lib/types'

function bestStreakFor(logs: LogMap, id: string) {
  let best = 0, cur = 0
  for (let i = 89; i >= 0; i--) {
    const done = !!logs[daysAgo(i)]?.[id]?.done
    cur = done ? cur + 1 : 0
    if (cur > best) best = cur
  }
  return best
}

function HabitProgress({ habit, logs }: { habit: Habit; logs: LogMap }) {
  const col = COLORS.find(c => c.id === habit.color_id) || COLORS[0]
  const cells = Array.from({ length: 30 }, (_, i) => daysAgo(29 - i))
  const doneCount = cells.filter(d => logs[d]?.[habit.id]?.done).length
  const pct = Math.round((doneCount / 30) * 100)

  return (
    <div style={{ background: T.surface, borderRadius: 16, boxShadow: T.shadowOut, padding: 16, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.hex, marginRight: 10, flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: T.fg }}>{habit.label}</span>
        <span style={{ fontSize: 11, color: T.fgDim }}>{pct}% · 30d</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 4, marginBottom: 12 }}>
        {cells.map((d, i) => {
          const done = !!logs[d]?.[habit.id]?.done
          return <div key={i} style={{ aspectRatio: '1', borderRadius: 3, background: done ? col.hex : T.sunken, boxShadow: done ? `0 0 4px ${col.hex}55` : T.shadowIn }} />
        })}
      </div>
      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: T.fgDim }}>
        <span>Current streak: <strong style={{ color: T.fg }}>{streak(logs, habit.id)}</strong></span>
        <span>Best: <strong style={{ color: T.fg }}>{bestStreakFor(logs, habit.id)}</strong></span>
      </div>
    </div>
  )
}

export default function ProgressPage() {
  const { habits, loading: hLoading } = useHabits()
  const { logs, loading: lLoading } = useLogs()

  if (hLoading || lLoading) return null

  return (
    <div style={{ padding: '32px 20px 120px', minHeight: '100vh', background: T.bg }}>
      <h1 className="serif" style={{ fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: T.fg, margin: '0 0 24px', letterSpacing: '-0.02em' }}>Progress</h1>
      {habits.length === 0 && <div style={{ fontSize: 13, color: T.fgDim }}>No habits yet — add one from Today to see progress here.</div>}
      {habits.map(h => <HabitProgress key={h.id} habit={h} logs={logs} />)}
    </div>
  )
}
