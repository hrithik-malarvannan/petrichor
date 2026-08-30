'use client'
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Habit, HabitInsert, HabitUpdate } from '@/lib/types'

async function api(path: string, options?: RequestInit) {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  })
  if (!res.ok) throw new Error(await res.text().catch(() => 'Request failed'))
  return res.json()
}

interface HabitsContextValue {
  habits: Habit[]
  loading: boolean
  addHabit: (data: HabitInsert) => Promise<void>
  updateHabit: (id: string, data: HabitUpdate) => Promise<void>
  removeHabit: (id: string) => Promise<void>
  reorderHabits: (next: Habit[]) => void
}

const HabitsContext = createContext<HabitsContextValue | null>(null)

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/api/habits')
      .then(setHabits)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const addHabit = useCallback(async (data: HabitInsert) => {
    const created: Habit = await api('/api/habits', { method: 'POST', body: JSON.stringify(data) })
    setHabits(prev => [...prev, created])
  }, [])

  const updateHabit = useCallback(async (id: string, data: HabitUpdate) => {
    const updated: Habit = await api(`/api/habits/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
    setHabits(prev => prev.map(h => (h.id === id ? updated : h)))
  }, [])

  const removeHabit = useCallback(async (id: string) => {
    await api(`/api/habits/${id}`, { method: 'DELETE' })
    setHabits(prev => prev.filter(h => h.id !== id))
  }, [])

  const reorderHabits = useCallback((next: Habit[]) => {
    const withPositions = next.map((h, i) => ({ ...h, position: i }))
    setHabits(withPositions)
    api('/api/habits/reorder', {
      method: 'POST',
      body: JSON.stringify({ ids: withPositions.map(h => h.id) }),
    }).catch(() => {})
  }, [])

  return (
    <HabitsContext.Provider value={{ habits, loading, addHabit, updateHabit, removeHabit, reorderHabits }}>
      {children}
    </HabitsContext.Provider>
  )
}

export function useHabits() {
  const ctx = useContext(HabitsContext)
  if (!ctx) throw new Error('useHabits must be used within HabitsProvider')
  return ctx
}
