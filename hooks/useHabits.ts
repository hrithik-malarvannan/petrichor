'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Habit, HabitInsert, HabitUpdate } from '@/lib/types'

const KEY = 'petrichor-habits'
const genId = () => Math.random().toString(36).slice(2, 10)

function load(): Habit[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function persist(habits: Habit[]) {
  try { window.localStorage.setItem(KEY, JSON.stringify(habits)) } catch {}
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setHabits(load())
    setLoading(false)
  }, [])

  const addHabit = useCallback(async (data: HabitInsert) => {
    const now = new Date().toISOString()
    setHabits(prev => {
      const next: Habit[] = [
        ...prev,
        { id: genId(), user_id: 'local', created_at: now, updated_at: now, ...data },
      ]
      persist(next)
      return next
    })
  }, [])

  const updateHabit = useCallback(async (id: string, data: HabitUpdate) => {
    setHabits(prev => {
      const next = prev.map(h => (h.id === id ? { ...h, ...data, updated_at: new Date().toISOString() } : h))
      persist(next)
      return next
    })
  }, [])

  const removeHabit = useCallback(async (id: string) => {
    setHabits(prev => {
      const next = prev.filter(h => h.id !== id)
      persist(next)
      return next
    })
  }, [])

  const reorderHabits = useCallback((next: Habit[]) => {
    const withPositions = next.map((h, i) => ({ ...h, position: i }))
    setHabits(withPositions)
    persist(withPositions)
  }, [])

  return { habits, loading, addHabit, updateHabit, removeHabit, reorderHabits }
}
