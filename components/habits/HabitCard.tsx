'use client'
import { useState, useRef } from 'react'
import { T, E, COLORS, CATEGORIES, DAY_LABELS } from '@/lib/constants'
import type { Habit, LogMap } from '@/lib/types'

function getColor(id: string) { return COLORS.find(c => c.id === id) || COLORS[0] }
function getCat(id: string) { return CATEGORIES.find(c => c.id === id) }
function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10) }

function Icon({ id, size = 16, color = 'currentColor' }: { id: string; size?: number; color?: string }) {
  const icons: Record<string, React.ReactNode> = {
    droplet: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2.5a.75.75 0 01.6.3l5.4 7.2a5.25 5.25 0 11-12 0l5.4-7.2a.75.75 0 01.6-.3z"/></svg>,
    bolt:    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z"/></svg>,
    book:    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06v-11a.75.75 0 00-.546-.721A9.006 9.006 0 0015 3a8.963 8.963 0 00-4.25 1.065V16.82zM9.25 4.065A8.963 8.963 0 005 3c-.85 0-1.673.118-2.454.339A.75.75 0 002 4.06v11a.75.75 0 00.954.721A7.506 7.506 0 015 15.5c1.579 0 3.042.487 4.25 1.32V4.065z"/></svg>,
    moon:    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>,
    heart:   <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.184C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.953a22.049 22.049 0 01-3.744 2.876l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z"/></svg>,
    star:    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"/></svg>,
    flame:   <svg viewBox="0 0 20 20" fill="currentColor"><path d="M15.99 9.674c0 4.418-2.686 7.576-6 7.576s-6-3.158-6-7.576C3.99 6.385 5.775 4.16 8.04 2.86a.75.75 0 011.15.748 5.057 5.057 0 00.663 3.14c.208.323.61.481.986.344 1.354-.487 2.157-1.657 2.157-3.484a.75.75 0 011.15-.748c2.265 1.3 4.05 3.524 4.05 6.814h-.157z"/></svg>,
    run:     <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75v-5.59l-2.47 2.47a.75.75 0 01-1.06-1.06l3.75-3.75a.75.75 0 011.06 0l3.75 3.75a.75.75 0 11-1.06 1.06L10.75 10.66v5.59A.75.75 0 0110 17z" clipRule="evenodd"/></svg>,
    brain:   <svg viewBox="0 0 20 20" fill="currentColor"><path d="M7.5 3a3.5 3.5 0 00-3.456 4.043A3.502 3.502 0 005.5 14H7v1.5a1.5 1.5 0 003 0V6a3.5 3.5 0 00-2.5-3.354V3zm5 0v-.354A3.5 3.5 0 0115 6v8a3.5 3.5 0 01-1.456 2.843A3.5 3.5 0 0110 13v1.5a1.5 1.5 0 003 0V14h1.5a3.502 3.502 0 001.456-6.957A3.5 3.5 0 0012.5 3z"/></svg>,
    leaf:    <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M13.5 3C9.91 3 7 5.91 7 9.5c0 1.33.39 2.57 1.06 3.62L3.29 17.9a1 1 0 001.42 1.4l4.78-4.77A6.5 6.5 0 1013.5 3z" clipRule="evenodd"/></svg>,
    pen:     <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-2.207 2.207L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>,
    dumbbell:<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 4a1 1 0 00-1 1v1H4a1 1 0 000 2h1v4H4a1 1 0 000 2h1v1a1 1 0 002 0v-1h6v1a1 1 0 002 0v-1h1a1 1 0 000-2h-1V8h1a1 1 0 000-2h-1V5a1 1 0 00-2 0v1H7V5a1 1 0 00-1-1z"/></svg>,
    music:   <svg viewBox="0 0 20 20" fill="currentColor"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/></svg>,
    sun:     <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zm6.31 2.69a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm-12.62 0a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06L4.63 5.75a.75.75 0 010-1.06zM10 6a4 4 0 100 8 4 4 0 000-8zm8 4a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM3.5 10.75H2a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5z"/></svg>,
  }
  return <span style={{ display: 'inline-flex', width: size, height: size, color, flexShrink: 0 }}>{icons[id] || icons.bolt}</span>
}

function streak(logs: LogMap, id: string) {
  let s = 0; const d = new Date()
  while (logs[d.toISOString().slice(0,10)]?.[id]?.done) { s++; d.setDate(d.getDate()-1) }
  return s
}

interface Props {
  habit: Habit; logs: LogMap; index: number
  onToggle: () => void; onSkip: () => void; onNote: () => void
  onEdit: () => void; onDelete: () => void
  dragHandlers: { onDragStart: () => void; onDragOver: (e: React.DragEvent) => void; onDragEnd: () => void }
}

export default function HabitCard({ habit, logs, index, onToggle, onSkip, onNote, onEdit, onDelete, dragHandlers }: Props) {
  const [pressed, setPressed] = useState(false)
  const [burst,   setBurst]   = useState(false)
  const [menuOpen,setMenuOpen]= useState(false)
  const [swipeX,  setSwipeX]  = useState(0)
  const [swiping, setSwiping] = useState(false)
  const pressTimer = useRef<ReturnType<typeof setTimeout>>()
  const startX = useRef<number | null>(null)

  const col   = getColor(habit.color_id)
  const tk    = new Date().toISOString().slice(0,10)
  const entry = logs[tk]?.[habit.id]
  const done  = !!entry?.done
  const s     = streak(logs, habit.id)
  const weekDays = Array.from({ length: 7 }, (_, i) => daysAgo(6 - i))

  const handleClick = () => {
    if (menuOpen) { setMenuOpen(false); return }
    if (!swiping) { if (!done) { setBurst(true); setTimeout(() => setBurst(false), 500) }; onToggle() }
  }
  const handleTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; setSwiping(true) }
  const handleTouchMove  = (e: React.TouchEvent) => {
    if (startX.current === null) return
    setSwipeX(Math.max(-72, Math.min(72, e.touches[0].clientX - startX.current)))
  }
  const handleTouchEnd = () => {
    if (swipeX > 55) { if (!done) { setBurst(true); setTimeout(() => setBurst(false), 500) }; onToggle() }
    else if (swipeX < -55) onSkip()
    setSwipeX(0); setSwiping(false); startX.current = null
  }

  return (
    <div
      draggable
      onDragStart={dragHandlers.onDragStart} onDragOver={dragHandlers.onDragOver} onDragEnd={dragHandlers.onDragEnd}
      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
      onPointerDown={() => { setPressed(true); pressTimer.current = setTimeout(() => onEdit(), 650) }}
      onPointerUp={() => { setPressed(false); clearTimeout(pressTimer.current) }}
      onPointerLeave={() => { setPressed(false); clearTimeout(pressTimer.current) }}
      onClick={handleClick}
      style={{
        background: T.surface, borderRadius: 18, marginBottom: 12,
        boxShadow: done ? `${T.shadowOut}, 0 0 0 1px ${col.hex}22` : pressed ? T.shadowBtnPr : T.shadowOut,
        transform: swiping ? `translateX(${swipeX}px)` : pressed ? 'scale(0.985)' : 'scale(1)',
        transition: swiping ? 'none' : `box-shadow .15s ${E}, transform .12s ${E}`,
        animation: `cardIn .4s ${E} ${index * 45}ms both`,
        cursor: 'pointer', overflow: 'hidden', position: 'relative',
      }}>
      {done && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom,${col.hex},${col.hex}44)`, borderRadius: '3px 0 0 3px' }}/>}
      {swipeX > 20 && <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: Math.min(1,(swipeX-20)/40), pointerEvents: 'none' }}>✓</div>}
      {swipeX < -20 && <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: Math.min(1,(-swipeX-20)/40), pointerEvents: 'none' }}>→</div>}
      {burst && <div style={{ position: 'absolute', inset: 0, borderRadius: 18, pointerEvents: 'none', background: `radial-gradient(circle at 50px 50%,${col.hex}30 0%,transparent 70%)`, animation: `fadeIn .4s ${E} forwards` }}/>}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 16px 10px' }}>
        <div style={{ opacity: .18, cursor: 'grab', flexShrink: 0, color: T.fgMuted }}>
          <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
            <circle cx="3" cy="3" r="1.5"/><circle cx="3" cy="7" r="1.5"/><circle cx="3" cy="11" r="1.5"/>
            <circle cx="7" cy="3" r="1.5"/><circle cx="7" cy="7" r="1.5"/><circle cx="7" cy="11" r="1.5"/>
          </svg>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: T.surface,
          boxShadow: done ? `${T.shadowIn},0 0 0 1.5px ${col.hex}55` : T.shadowSm,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {habit.custom_emoji ? <span style={{ fontSize: 17 }}>{habit.custom_emoji}</span> : <Icon id={habit.icon_id} size={16} color={done ? col.hex : T.fgMuted}/>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: done ? T.fg : T.fgMuted }}>{habit.label}</span>
            {getCat(habit.category_id) && (
              <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 99,
                color: getCat(habit.category_id)!.color, letterSpacing: '0.06em', textTransform: 'uppercase',
                border: `1px solid ${getCat(habit.category_id)!.color}33` }}>
                {getCat(habit.category_id)!.label}
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: s > 0 ? col.hex : T.fgDim }}>
            {s >= 7 ? `${s} day streak ✦` : s > 0 ? `${s} day streak` : 'Begin today'}
          </div>
          {entry?.note && <div style={{ fontSize: 11, color: T.fgDim, marginTop: 3, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{entry.note}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, position: 'relative' }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: done ? col.hex : T.surface,
            boxShadow: done ? `0 0 10px ${col.hex}44` : T.shadowIn,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {done && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <button onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
              color: T.fgDim, display: 'flex', flexDirection: 'column', gap: 2.5, alignItems: 'center' }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor' }}/>)}
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', right: 0, top: 56, zIndex: 20, background: T.raised,
              borderRadius: 12, boxShadow: `${T.shadowOut},0 0 0 1px ${T.border}`,
              overflow: 'hidden', minWidth: 148, animation: `cardIn .2s ${E} both` }}
              onClick={e => e.stopPropagation()}>
              {[
                { label: 'Edit',                           action: () => { onEdit();   setMenuOpen(false) } },
                { label: 'Add note',                       action: () => { onNote();   setMenuOpen(false) } },
                { label: done ? 'Mark undone' : 'Mark done', action: () => { onToggle(); setMenuOpen(false) } },
                { label: 'Skip today',                     action: () => { onSkip();   setMenuOpen(false) } },
                { label: 'Delete',                         action: () => { onDelete(); setMenuOpen(false) }, danger: true },
              ].map((item, i, arr) => (
                <button key={item.label} onClick={item.action} style={{
                  display: 'flex', alignItems: 'center', width: '100%', padding: '11px 14px',
                  border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left', fontSize: 13, color: (item as any).danger ? '#c47c7c' : T.fg,
                  borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.surface)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '0 16px 12px 44px', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 5, flex: 1 }}>
          {weekDays.map((day, i) => {
            const d = !!logs[day]?.[habit.id]?.done
            const isT = day === tk
            const dow = new Date(day + 'T12:00:00').getDay()
            const sch = !habit.schedule_days || habit.schedule_days.includes(dow)
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: d ? col.hex : T.sunken,
                  boxShadow: d ? `0 0 6px ${col.hex}55` : T.shadowIn,
                  border: isT ? `1px solid ${col.hex}66` : 'none', opacity: sch ? 1 : 0.3 }}/>
                <span style={{ fontSize: 8, color: isT ? col.hex : T.fgDim }}>{DAY_LABELS[dow].slice(0,1)}</span>
              </div>
            )
          })}
        </div>
        {habit.goal > 0 && <span style={{ fontSize: 10, color: T.fgDim, marginLeft: 12 }}>{weekDays.filter(d => logs[d]?.[habit.id]?.done).length}/{habit.goal}</span>}
      </div>
    </div>
  )
}
