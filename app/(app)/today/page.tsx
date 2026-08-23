'use client'
import { useState } from 'react'
import { useHabits } from '@/hooks/useHabits'
import { useLogs } from '@/hooks/useLogs'
import { Neu, NeuBtn, Ring, Skeleton } from '@/components/ui/Neu'
import HabitCard from '@/components/habits/HabitCard'
import HabitSheet from '@/components/habits/HabitSheet'
import NoteSheet from '@/components/habits/NoteSheet'
import EndDayModal from '@/components/habits/EndDayModal'
import { todayStr, daysAgo, isScheduledToday } from '@/lib/utils'
import { DAY_LABELS, CATEGORIES } from '@/lib/constants'
import type { Habit, HabitInsert } from '@/lib/types'

const T = {
  fg: '#f0ece4', fgMuted: '#7a7672', fgDim: '#3d3a37',
  accent: '#c8a96e', border: '#1e1e1e', surface: '#111111',
  shadowOut: '6px 6px 14px #050505, -4px -4px 10px #1a1a1a',
}
const E = 'cubic-bezier(0.16,1,0.3,1)'

export default function TodayPage() {
  const { habits, loading: habitsLoading, addHabit, updateHabit, removeHabit, reorderHabits } = useHabits()
  const { logs, summaries, toggleLog, skipLog, saveNote, saveDaySummary } = useLogs()
  const [filterCat, setFilterCat]   = useState('all')
  const [sheet,     setSheet]       = useState<null | 'new' | Habit>(null)
  const [noteHabit, setNoteHabit]   = useState<Habit | null>(null)
  const [showEndDay, setShowEndDay] = useState(false)
  const [showFAB,   setShowFAB]     = useState(false)

  const tk       = todayStr()
  const now      = new Date()
  const hrs      = now.getHours()
  const greeting = hrs < 5 ? 'Still up?' : hrs < 12 ? 'Good morning' : hrs < 17 ? 'Good afternoon' : hrs < 21 ? 'Good evening' : 'Good night'
  const dateLabel = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const sched     = habits.filter(isScheduledToday)
  const doneCount = sched.filter(h => logs[tk]?.[h.id]?.done).length
  const pct       = sched.length ? Math.round(doneCount / sched.length * 100) : 0
  const allDone   = doneCount === sched.length && sched.length > 0
  const filtered  = filterCat === 'all' ? sched : sched.filter(h => h.category_id === filterCat)

  // Drag reorder
  const dragIdx = { current: -1 }
  const onDragStart = (i: number) => { dragIdx.current = i }
  const onDragOver  = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (dragIdx.current === i) return
    const next = [...habits]
    const [moved] = next.splice(dragIdx.current, 1)
    next.splice(i, 0, moved)
    dragIdx.current = i
    reorderHabits(next)
  }

  if (habitsLoading) return <TodaySkeleton/>

  return (
    <div style={{ padding: '32px 20px 120px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, animation: `cardIn .5s ${E} both` }}>
        <div style={{ fontSize: 9, color: T.fgDim, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
          {dateLabel}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 className="serif" style={{ fontSize: 28, fontWeight: 400, fontStyle: 'italic',
              color: T.fg, margin: '0 0 4px', lineHeight: 1.2 }}>
              {greeting}.
            </h1>
            <div style={{ fontSize: 13, color: T.fgMuted, fontWeight: 300 }}>
              {allDone ? 'Every habit complete.' : `${sched.length - doneCount} remaining today`}
            </div>
          </div>
          <Neu style={{ width: 56, height: 56, borderRadius: '50%', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ring pct={pct} size={44} stroke={3} done={allDone}/>
            <div style={{ position: 'absolute', fontSize: 11, fontWeight: 600,
              color: allDone ? '#7ca885' : T.accent }}>{pct}%</div>
          </Neu>
        </div>

        {/* Week strip */}
        <div style={{ display: 'flex', gap: 4, marginTop: 18 }}>
          {Array.from({ length: 7 }, (_, i) => daysAgo(6 - i)).map((day, i) => {
            const dayHabits = habits.filter(h => !h.schedule_days || h.schedule_days.includes(new Date(day + 'T12:00').getDay()))
            const done = dayHabits.filter(h => logs[day]?.[h.id]?.done).length
            const p    = dayHabits.length ? done / dayHabits.length : 0
            const isT  = day === tk
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', height: 3, borderRadius: 2,
                  background: p > 0 ? `rgba(200,169,110,${0.2 + p * 0.8})` : T.border,
                  boxShadow: isT ? `0 0 4px ${T.accent}44` : 'none' }}/>
                <span style={{ fontSize: 9, color: isT ? T.accent : T.fgDim, letterSpacing: '0.06em' }}>
                  {DAY_LABELS[new Date(day + 'T12:00').getDay()].slice(0, 1)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 20, paddingBottom: 2 }}>
        {[{ id: 'all', label: 'All', color: T.fgMuted }, ...CATEGORIES].map(c => (
          <button key={c.id} onClick={() => setFilterCat(c.id)} style={{
            padding: '5px 12px', borderRadius: 99, whiteSpace: 'nowrap',
            fontFamily: 'var(--font-sans)',
            border: `1px solid ${filterCat === c.id ? c.color + '55' : T.border}`,
            background: filterCat === c.id ? `${c.color}10` : '#111',
            color: filterCat === c.id ? c.color : T.fgDim,
            boxShadow: filterCat === c.id ? '3px 3px 8px #050505, -2px -2px 6px #191919' : '4px 4px 10px #050505, -3px -3px 8px #1c1c1c',
            fontSize: 11, fontWeight: 500, cursor: 'pointer', letterSpacing: '0.03em',
            transition: `all .15s ${E}`, flexShrink: 0,
          }}>{c.label}</button>
        ))}
      </div>

      {/* Habits */}
      {filtered.length === 0 ? (
        <Neu style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div className="serif" style={{ fontSize: 18, color: T.fgMuted, fontStyle: 'italic', marginBottom: 6 }}>Nothing scheduled.</div>
          <div style={{ fontSize: 12, color: T.fgDim }}>Add a habit to begin.</div>
        </Neu>
      ) : filtered.map((h, i) => (
        <HabitCard key={h.id} habit={h} logs={logs} index={i}
          onToggle={() => toggleLog(h.id, tk)}
          onSkip={() => skipLog(h.id, tk)}
          onNote={() => setNoteHabit(h)}
          onEdit={() => setSheet(h)}
          onDelete={() => removeHabit(h.id)}
          dragHandlers={{
            onDragStart: () => onDragStart(habits.indexOf(h)),
            onDragOver:  (e: React.DragEvent) => onDragOver(e, habits.indexOf(h)),
            onDragEnd:   () => {},
          }}/>
      ))}

      {allDone && sched.length > 0 && (
        <Neu style={{ marginTop: 4, padding: '16px 20px', textAlign: 'center', border: `1px solid ${T.accent}22` }}>
          <div className="serif" style={{ fontSize: 16, color: T.accent, fontStyle: 'italic' }}>Flawless. ✦</div>
        </Neu>
      )}

      {/* End day */}
      {sched.length > 0 && (
        <NeuBtn onClick={() => setShowEndDay(true)} style={{ width: '100%', marginTop: 16, color: T.fgMuted,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          ◐ End day & reflect
        </NeuBtn>
      )}

      {/* FAB */}
      <div style={{ position: 'fixed', bottom: 88, right: 20, zIndex: 30 }}>
        {showFAB && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', marginBottom: 10 }}>
            {[
              { label: 'New habit',  action: () => { setSheet('new'); setShowFAB(false) } },
            ].map((item, i) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10,
                animation: `cardIn .3s ${E} ${i * 50}ms both` }}>
                <Neu style={{ padding: '7px 14px', borderRadius: 99 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: T.fg, letterSpacing: '0.03em' }}>{item.label}</span>
                </Neu>
                <button onClick={item.action} style={{ width: 42, height: 42, borderRadius: '50%', border: 'none',
                  cursor: 'pointer', background: '#111111',
                  boxShadow: '6px 6px 14px #050505, -4px -4px 10px #1a1a1a',
                  color: T.accent, fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>＋</button>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setShowFAB(v => !v)} style={{
          width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: '#111111', boxShadow: '6px 6px 14px #050505, -4px -4px 10px #1a1a1a',
          color: T.accent, fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: showFAB ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: `transform .25s ${E}`,
        }}>＋</button>
      </div>

      {/* Sheets */}
      {sheet && (
        <HabitSheet
          habit={sheet === 'new' ? null : sheet}
          onSave={async data => {
            if (sheet === 'new') await addHabit(data as HabitInsert)
            else await updateHabit(sheet.id, data)
            setSheet(null)
          }}
          onClose={() => setSheet(null)}/>
      )}
      {noteHabit && (
        <NoteSheet habit={noteHabit} currentNote={logs[tk]?.[noteHabit.id]?.note ?? ''}
          onSave={async note => { await saveNote(noteHabit.id, tk, note); setNoteHabit(null) }}
          onClose={() => setNoteHabit(null)}/>
      )}
      {showEndDay && (
        <EndDayModal habits={habits} logs={logs} currentSummary={summaries[tk]}
          onSave={async ({ mood, journal }) => { await saveDaySummary(tk, mood, journal); setShowEndDay(false) }}
          onClose={() => setShowEndDay(false)}/>
      )}
    </div>
  )
}

function TodaySkeleton() {
  return (
    <div style={{ padding: '32px 20px 120px' }}>
      <Skeleton width="60%" height={12} radius={4}/>
      <div style={{ marginTop: 10, marginBottom: 28 }}><Skeleton width="40%" height={28} radius={6}/></div>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ marginBottom: 12 }}><Skeleton height={80} radius={16}/></div>
      ))}
    </div>
  )
}
