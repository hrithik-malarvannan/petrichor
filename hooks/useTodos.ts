'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Todo, TodoState } from '@/lib/types'

const KEY = 'petrichor-todos'
const genId = () => Math.random().toString(36).slice(2, 10)
const today = () => new Date().toISOString().slice(0, 10)
const EMPTY: TodoState = { daily: {}, general: [] }

function load(): TodoState {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch { return EMPTY }
}

function persist(state: TodoState) {
  try { window.localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
}

function makeTodo(text: string, date: string | null, position: number): Todo {
  const now = new Date().toISOString()
  return { id: genId(), user_id: 'local', date, text, priority: 'none', done: false, position, created_at: now, updated_at: now }
}

export function useTodos() {
  const [state, setState] = useState<TodoState>(EMPTY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setState(load())
    setLoading(false)
  }, [])

  const addDailyTodo = useCallback((text: string, date: string = today()) => {
    setState(prev => {
      const list = prev.daily[date] || []
      const next = { ...prev, daily: { ...prev.daily, [date]: [...list, makeTodo(text, date, list.length)] } }
      persist(next)
      return next
    })
  }, [])

  const addGeneralTodo = useCallback((text: string) => {
    setState(prev => {
      const next = { ...prev, general: [...prev.general, makeTodo(text, null, prev.general.length)] }
      persist(next)
      return next
    })
  }, [])

  const toggleDailyTodo = useCallback((id: string, date: string = today()) => {
    setState(prev => {
      const list = (prev.daily[date] || []).map(t => (t.id === id ? { ...t, done: !t.done } : t))
      const next = { ...prev, daily: { ...prev.daily, [date]: list } }
      persist(next)
      return next
    })
  }, [])

  const toggleGeneralTodo = useCallback((id: string) => {
    setState(prev => {
      const next = { ...prev, general: prev.general.map(t => (t.id === id ? { ...t, done: !t.done } : t)) }
      persist(next)
      return next
    })
  }, [])

  const deleteDailyTodo = useCallback((id: string, date: string = today()) => {
    setState(prev => {
      const list = (prev.daily[date] || []).filter(t => t.id !== id)
      const next = { ...prev, daily: { ...prev.daily, [date]: list } }
      persist(next)
      return next
    })
  }, [])

  const deleteGeneralTodo = useCallback((id: string) => {
    setState(prev => {
      const next = { ...prev, general: prev.general.filter(t => t.id !== id) }
      persist(next)
      return next
    })
  }, [])

  return {
    daily: state.daily,
    general: state.general,
    loading,
    addDailyTodo, addGeneralTodo,
    toggleDailyTodo, toggleGeneralTodo,
    deleteDailyTodo, deleteGeneralTodo,
  }
}
