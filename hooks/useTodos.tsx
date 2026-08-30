'use client'
import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import type { Todo } from '@/lib/types'

const today = () => new Date().toISOString().slice(0, 10)

async function api(path: string, options?: RequestInit) {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  })
  if (!res.ok) throw new Error(await res.text().catch(() => 'Request failed'))
  return res.json()
}

function split(todos: Todo[]) {
  const daily: Record<string, Todo[]> = {}
  const general: Todo[] = []
  for (const t of todos) {
    if (t.date) { (daily[t.date] ||= []).push(t) }
    else general.push(t)
  }
  return { daily, general }
}

interface TodosContextValue {
  daily: Record<string, Todo[]>
  general: Todo[]
  loading: boolean
  addDailyTodo: (text: string, date?: string) => void
  addGeneralTodo: (text: string) => void
  toggleDailyTodo: (id: string) => void
  toggleGeneralTodo: (id: string) => void
  deleteDailyTodo: (id: string) => void
  deleteGeneralTodo: (id: string) => void
}

const TodosContext = createContext<TodosContextValue | null>(null)

export function TodosProvider({ children }: { children: ReactNode }) {
  const [all, setAll] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const allRef = useRef<Todo[]>([])
  allRef.current = all

  useEffect(() => {
    api('/api/todos').then(setAll).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const addDailyTodo = useCallback((text: string, date: string = today()) => {
    const position = allRef.current.filter(t => t.date === date).length
    api('/api/todos', { method: 'POST', body: JSON.stringify({ text, date, priority: 'none', done: false, position }) })
      .then((created: Todo) => setAll(p => [...p, created]))
      .catch(() => {})
  }, [])

  const addGeneralTodo = useCallback((text: string) => {
    const position = allRef.current.filter(t => t.date === null).length
    api('/api/todos', { method: 'POST', body: JSON.stringify({ text, date: null, priority: 'none', done: false, position }) })
      .then((created: Todo) => setAll(p => [...p, created]))
      .catch(() => {})
  }, [])

  const toggleDailyTodo = useCallback((id: string) => {
    setAll(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)))
    const cur = allRef.current.find(t => t.id === id)
    api(`/api/todos/${id}`, { method: 'PATCH', body: JSON.stringify({ done: !cur?.done }) }).catch(() => {})
  }, [])

  const toggleGeneralTodo = useCallback((id: string) => {
    setAll(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)))
    const cur = allRef.current.find(t => t.id === id)
    api(`/api/todos/${id}`, { method: 'PATCH', body: JSON.stringify({ done: !cur?.done }) }).catch(() => {})
  }, [])

  const deleteDailyTodo = useCallback((id: string) => {
    setAll(prev => prev.filter(t => t.id !== id))
    api(`/api/todos/${id}`, { method: 'DELETE' }).catch(() => {})
  }, [])

  const deleteGeneralTodo = useCallback((id: string) => {
    setAll(prev => prev.filter(t => t.id !== id))
    api(`/api/todos/${id}`, { method: 'DELETE' }).catch(() => {})
  }, [])

  const { daily, general } = split(all)

  return (
    <TodosContext.Provider value={{
      daily, general, loading,
      addDailyTodo, addGeneralTodo,
      toggleDailyTodo, toggleGeneralTodo,
      deleteDailyTodo, deleteGeneralTodo,
    }}>
      {children}
    </TodosContext.Provider>
  )
}

export function useTodos() {
  const ctx = useContext(TodosContext)
  if (!ctx) throw new Error('useTodos must be used within TodosProvider')
  return ctx
}
