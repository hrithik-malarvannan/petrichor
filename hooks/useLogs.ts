'use client'
import { useState, useEffect, useCallback } from 'react'
import type { LogMap, SummaryMap } from '@/lib/types'

const LOGS_KEY = 'petrichor-logs'
const SUMMARIES_KEY = 'petrichor-summaries'

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function persist(key: string, value: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function useLogs() {
  const [logs, setLogs] = useState<LogMap>({})
  const [summaries, setSummaries] = useState<SummaryMap>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLogs(loadJSON<LogMap>(LOGS_KEY, {}))
    setSummaries(loadJSON<SummaryMap>(SUMMARIES_KEY, {}))
    setLoading(false)
  }, [])

  const toggleLog = useCallback(async (habitId: string, date: string) => {
    setLogs(prev => {
      const cur = prev[date]?.[habitId]
      const dayEntry = { ...(prev[date] || {}), [habitId]: { done: !cur?.done, skipped: false, note: cur?.note ?? null } }
      const next = { ...prev, [date]: dayEntry }
      persist(LOGS_KEY, next)
      return next
    })
  }, [])

  const skipLog = useCallback(async (habitId: string, date: string) => {
    setLogs(prev => {
      const cur = prev[date]?.[habitId]
      const dayEntry = { ...(prev[date] || {}), [habitId]: { done: false, skipped: !cur?.skipped, note: cur?.note ?? null } }
      const next = { ...prev, [date]: dayEntry }
      persist(LOGS_KEY, next)
      return next
    })
  }, [])

  const saveNote = useCallback(async (habitId: string, date: string, note: string) => {
    setLogs(prev => {
      const cur = prev[date]?.[habitId]
      const dayEntry = { ...(prev[date] || {}), [habitId]: { done: cur?.done ?? false, skipped: cur?.skipped ?? false, note } }
      const next = { ...prev, [date]: dayEntry }
      persist(LOGS_KEY, next)
      return next
    })
  }, [])

  const saveDaySummary = useCallback(async (date: string, mood: number | null, journal: string) => {
    setSummaries(prev => {
      const next = { ...prev, [date]: { mood, journal } }
      persist(SUMMARIES_KEY, next)
      return next
    })
  }, [])

  return { logs, summaries, loading, toggleLog, skipLog, saveNote, saveDaySummary }
}
