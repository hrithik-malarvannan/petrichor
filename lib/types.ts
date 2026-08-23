/* ─── Petrichor — Database Types ────────────────────────────
   Mirrors the Supabase schema exactly.
──────────────────────────────────────────────────────────── */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Habit {
  id: string; user_id: string; label: string; icon_id: string
  custom_emoji: string | null; color_id: string; custom_color: string | null
  category_id: string; goal: number; goal_type: 'days' | 'specific'
  schedule_days: number[]; reminder_time: string | null; reminder_on: boolean
  position: number; archived: boolean; created_at: string; updated_at: string
}
export type HabitInsert = Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type HabitUpdate = Partial<HabitInsert>

export interface HabitLog {
  id: string; user_id: string; habit_id: string; date: string
  done: boolean; skipped: boolean; note: string | null
  created_at: string; updated_at: string
}
export type HabitLogUpdate = Partial<Pick<HabitLog, 'done' | 'skipped' | 'note'>>

export interface DaySummary {
  id: string; user_id: string; date: string
  mood: number | null; journal: string | null
  created_at: string; updated_at: string
}
export type DaySummaryUpdate = Partial<Pick<DaySummary, 'mood' | 'journal'>>

export interface Todo {
  id: string; user_id: string; date: string | null; text: string
  priority: 'none' | 'low' | 'med' | 'high'; done: boolean
  position: number; created_at: string; updated_at: string
}
export type TodoInsert = Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type TodoUpdate = Partial<Pick<Todo, 'text' | 'done' | 'priority' | 'position'>>

export interface LogEntry { done: boolean; skipped: boolean; note: string | null }
export type LogMap = Record<string, Record<string, LogEntry>>
export interface DaySummaryEntry { mood: number | null; journal: string | null }
export type SummaryMap = Record<string, DaySummaryEntry>
export interface TodoState { daily: Record<string, Todo[]>; general: Todo[] }
