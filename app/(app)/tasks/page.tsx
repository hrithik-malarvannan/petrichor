'use client'
import { useState } from 'react'
import { T } from '@/lib/constants'
import { useTodos } from '@/hooks/useTodos'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: T.fgDim, textTransform: 'uppercase', marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  )
}

function TodoRow({ text, done, onToggle, onDelete }: { text: string; done: boolean; onToggle: () => void; onDelete: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: T.surface, borderRadius: 14, boxShadow: T.shadowOut, padding: '13px 14px', marginBottom: 9 }}>
      <button onClick={onToggle} style={{
        width: 22, height: 22, borderRadius: 7, border: 'none', cursor: 'pointer', flexShrink: 0,
        background: done ? T.accent : T.surface, boxShadow: done ? `0 0 8px ${T.accent}44` : T.shadowIn,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {done && <svg width="11" height="9" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </button>
      <span style={{ flex: 1, fontSize: 13, color: done ? T.fgDim : T.fg, textDecoration: done ? 'line-through' : 'none' }}>{text}</span>
      <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.fgDim, fontSize: 13, padding: 4 }}>✕</button>
    </div>
  )
}

function AddRow({ placeholder, onAdd }: { placeholder: string; onAdd: (text: string) => void }) {
  const [value, setValue] = useState('')
  const submit = () => { if (value.trim()) { onAdd(value.trim()); setValue('') } }
  return (
    <div style={{ display: 'flex', gap: 8, background: T.sunken, borderRadius: 12, boxShadow: T.shadowIn, marginBottom: 16 }}>
      <input value={value} onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit() }}
        placeholder={placeholder}
        style={{ flex: 1, padding: '12px 14px', background: 'transparent', border: 'none', color: T.fg, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}/>
      <button onClick={submit} style={{ padding: '0 16px', background: 'none', border: 'none', color: T.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add</button>
    </div>
  )
}

export default function TasksPage() {
  const { daily, general, loading, addDailyTodo, addGeneralTodo, toggleDailyTodo, toggleGeneralTodo, deleteDailyTodo, deleteGeneralTodo } = useTodos()
  const today = new Date().toISOString().slice(0, 10)
  const todayList = daily[today] || []

  if (loading) return null

  return (
    <div style={{ padding: '32px 20px 120px', minHeight: '100vh', background: T.bg }}>
      <h1 className="serif" style={{ fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: T.fg, margin: '0 0 24px', letterSpacing: '-0.02em' }}>Tasks</h1>

      <Section title="Today">
        <AddRow placeholder="Add a task for today…" onAdd={t => addDailyTodo(t)} />
        {todayList.length === 0 && <div style={{ fontSize: 12, color: T.fgDim, padding: '4px 2px' }}>Nothing yet — add your first task.</div>}
        {todayList.map(t => (
          <TodoRow key={t.id} text={t.text} done={t.done} onToggle={() => toggleDailyTodo(t.id)} onDelete={() => deleteDailyTodo(t.id)} />
        ))}
      </Section>

      <Section title="General">
        <AddRow placeholder="Add a general task…" onAdd={addGeneralTodo} />
        {general.length === 0 && <div style={{ fontSize: 12, color: T.fgDim, padding: '4px 2px' }}>No general tasks.</div>}
        {general.map(t => (
          <TodoRow key={t.id} text={t.text} done={t.done} onToggle={() => toggleGeneralTodo(t.id)} onDelete={() => deleteGeneralTodo(t.id)} />
        ))}
      </Section>
    </div>
  )
}
