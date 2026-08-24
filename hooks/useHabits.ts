'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Habit, HabitInsert, HabitUpdate } from '@/lib/types'

async function api(path: string, options?: RequestInit) {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  })
  if (!res.ok) throw new Error(await res.text().catch(() => 'Request failed'))
  return res.json()
}

export function useHabits() {
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

  return { habits, loading, addHabit, updateHabit, removeHabit, reorderHabits }
}
