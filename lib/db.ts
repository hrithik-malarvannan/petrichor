/* ─── All database queries in one place ─────────────────────
   Every function takes a supabase client so it works in both
   server and client contexts. Throws on error — callers catch.
──────────────────────────────────────────────────────────── */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Habit, HabitInsert, HabitUpdate,
              HabitLog, HabitLogUpdate, DaySummary,
              DaySummaryUpdate, Todo, TodoInsert, TodoUpdate } from './types'

type DB = SupabaseClient<Database>

/* ── Habits ─────────────────────────────────────────────── */

export async function getHabits(db: DB): Promise<Habit[]> {
  const { data, error } = await db
    .from('habits')
    .select('*')
    .eq('archived', false)
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function createHabit(db: DB, habit: HabitInsert): Promise<Habit> {
  const { data, error } = await db
    .from('habits')
    .insert(habit)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateHabit(db: DB, id: string, updates: HabitUpdate): Promise<Habit> {
  const { data, error } = await db
    .from('habits')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteHabit(db: DB, id: string): Promise<void> {
  // Soft delete — keeps historical logs intact
  const { error } = await db
    .from('habits')
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function reorderHabits(db: DB, ids: string[]): Promise<void> {
  // Update position for each habit in bulk
  const updates = ids.map((id, position) => ({
    id,
    position,
    updated_at: new Date().toISOString(),
  }))
  const { error } = await db.from('habits').upsert(updates, { onConflict: 'id' })
  if (error) throw error
}

/* ── Habit Logs ─────────────────────────────────────────── */

export async function getLogs(db: DB, since: string): Promise<HabitLog[]> {
  const { data, error } = await db
    .from('habit_logs')
    .select('*')
    .gte('date', since)
    .order('date', { ascending: true })
  if (error) throw error
  return data
}

export async function upsertLog(
  db: DB,
  habitId: string,
  date: string,
  updates: HabitLogUpdate,
): Promise<HabitLog> {
  const { data, error } = await db
    .from('habit_logs')
    .upsert(
      { habit_id: habitId, date, ...updates, updated_at: new Date().toISOString() },
      { onConflict: 'habit_id,date' },
    )
    .select()
    .single()
  if (error) throw error
  return data
}

export async function toggleLog(
  db: DB,
  habitId: string,
  date: string,
  currentDone: boolean,
): Promise<HabitLog> {
  return upsertLog(db, habitId, date, { done: !currentDone, skipped: false })
}

export async function skipLog(
  db: DB,
  habitId: string,
  date: string,
  currentSkipped: boolean,
): Promise<HabitLog> {
  return upsertLog(db, habitId, date, { skipped: !currentSkipped, done: false })
}

export async function saveNote(
  db: DB,
  habitId: string,
  date: string,
  note: string,
): Promise<HabitLog> {
  return upsertLog(db, habitId, date, { note })
}

/* ── Day Summaries (mood + journal) ─────────────────────── */

export async function getDaySummaries(db: DB, since: string): Promise<DaySummary[]> {
  const { data, error } = await db
    .from('day_summaries')
    .select('*')
    .gte('date', since)
    .order('date', { ascending: true })
  if (error) throw error
  return data
}

export async function upsertDaySummary(
  db: DB,
  date: string,
  updates: DaySummaryUpdate,
): Promise<DaySummary> {
  const { data, error } = await db
    .from('day_summaries')
    .upsert(
      { date, ...updates, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,date' },
    )
    .select()
    .single()
  if (error) throw error
  return data
}

/* ── Todos ──────────────────────────────────────────────── */

export async function getTodos(db: DB): Promise<Todo[]> {
  const { data, error } = await db
    .from('todos')
    .select('*')
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function createTodo(db: DB, todo: TodoInsert): Promise<Todo> {
  const { data, error } = await db
    .from('todos')
    .insert(todo)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTodo(db: DB, id: string, updates: TodoUpdate): Promise<Todo> {
  const { data, error } = await db
    .from('todos')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTodo(db: DB, id: string): Promise<void> {
  const { error } = await db.from('todos').delete().eq('id', id)
  if (error) throw error
}

export async function toggleTodo(db: DB, id: string, currentDone: boolean): Promise<Todo> {
  return updateTodo(db, id, { done: !currentDone })
}
