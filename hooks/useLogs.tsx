'use client'
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { LogMap, SummaryMap, HabitLog, DaySummary } from '@/lib/types'

const SINCE_DAYS = 120
function sinceDate() {
  const d = new Date()
  d.setDate(d.getDate() - SINCE_DAYS)
  return d.toISOString().slice(0, 10)
}

async function api(path: string, options?: RequestInit) {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  })
  if (!res.ok) throw new Error(await res.text().catch(() => 'Request failed'))
  return res.json()
}

function logsToMap(rows: HabitLog[]): LogMap {
  const map: LogMap = {}
  for (const r of rows) {
    if (!map[r.date]) map[r.date] = {}
    map[r.date][r.habit_id] = { done: r.done, skipped: r.skipped, note: r.note }
  }
  return map
}

function summariesToMap(rows: DaySummary[]): SummaryMap {
  const map: SummaryMap = {}
  for (const r of rows) map[r.date] = { mood: r.mood, journal: r.journal }
  return map
}

interface LogsContextValue {
  logs: LogMap
  summaries: SummaryMap
  loading: boolean
  toggleLog: (habitId: string, date: string) => Promise<void>
  skipLog: (habitId: string, date: string) => Promise<void>
  saveNote: (habitId: string, date: string, note: string) => Promise<void>
  saveDaySummary: (date: string, mood: number | null, journal: string) => Promise<void>
}

const LogsContext = createContext<LogsContextValue | null>(null)

export function LogsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogMap>({})
  const [summaries, setSummaries] = useState<SummaryMap>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const since = sinceDate()
    Promise.all([api(`/api/logs?since=${since}`), api(`/api/summaries?since=${since}`)])
      .then(([logRows, summaryRows]) => {
        setLogs(logsToMap(logRows))
        setSummaries(summariesToMap(summaryRows))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleLog = useCallback(async (habitId: string, date: string) => {
    setLogs(prev => {
      const cur = prev[date]?.[habitId]
      const dayEntry = { ...(prev[date] || {}), [habitId]: { done: !cur?.done, skipped: false, note: cur?.note ?? null } }
      return { ...prev, [date]: dayEntry }
    })
    try {
      const updated: HabitLog = await api('/api/logs/toggle', { method: 'POST', body: JSON.stringify({ habitId, date }) })
      setLogs(prev => ({ ...prev, [date]: { ...(prev[date] || {}), [habitId]: { done: updated.done, skipped: updated.skipped, note: updated.note } } }))
    } catch {}
  }, [])

  const skipLog = useCallback(async (habitId: string, date: string) => {
    setLogs(prev => {
      const cur = prev[date]?.[habitId]
      const dayEntry = { ...(prev[date] || {}), [habitId]: { done: false, skipped: !cur?.skipped, note: cur?.note ?? null } }
      return { ...prev, [date]: dayEntry }
    })
    try {
      const updated: HabitLog = await api('/api/logs/skip', { method: 'POST', body: JSON.stringify({ habitId, date }) })
      setLogs(prev => ({ ...prev, [date]: { ...(prev[date] || {}), [habitId]: { done: updated.done, skipped: updated.skipped, note: updated.note } } }))
    } catch {}
  }, [])

  const saveNote = useCallback(async (habitId: string, date: string, note: string) => {
    setLogs(prev => {
      const cur = prev[date]?.[habitId]
      const dayEntry = { ...(prev[date] || {}), [habitId]: { done: cur?.done ?? false, skipped: cur?.skipped ?? false, note } }
      return { ...prev, [date]: dayEntry }
    })
    try {
      await api('/api/logs/note', { method: 'POST', body: JSON.stringify({ habitId, date, note }) })
    } catch {}
  }, [])

  const saveDaySummary = useCallback(async (date: string, mood: number | null, journal: string) => {
    setSummaries(prev => ({ ...prev, [date]: { mood, journal } }))
    try {
      await api('/api/summaries', { method: 'POST', body: JSON.stringify({ date, mood, journal }) })
    } catch {}
  }, [])

  return (
    <LogsContext.Provider value={{ logs, summaries, loading, toggleLog, skipLog, saveNote, saveDaySummary }}>
      {children}
    </LogsContext.Provider>
  )
}

export function useLogs() {
  const ctx = useContext(LogsContext)
  if (!ctx) throw new Error('useLogs must be used within LogsProvider')
  return ctx
}
