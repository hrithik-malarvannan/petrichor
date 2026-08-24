/* ─── All database queries in one place ─────────────────────
   Every function takes a supabase client so it works in both
   server and client contexts. Throws on error — callers catch.
   Single-user app: every row is stamped with and filtered by
   a fixed USER_ID (see lib/supabaseAdmin.ts) since there's no
   live login session to derive it from.
──────────────────────────────────────────────────────────── */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Habit, HabitInsert, HabitUpdate,
              HabitLog, HabitLogUpdate, DaySummary,
              DaySummaryUpdate, Todo, TodoInsert, TodoUpdate } from './types'
import { USER_ID } from './supabaseAdmin'

type DB = SupabaseClient<Database>

/* ── Habits ─────────────────────────────────────────────── */

export async function getHabits(db: DB): Promise<Habit[]> {
  const { data, error } = await db
    .from('habits')
    .select('*')
    .eq('user_id', USER_ID)
    .eq('archived', false)
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function createHabit(db: DB, habit: HabitInsert): Promise<Habit> {
  const { data, error } = await db
    .from('habits')
    .insert({ ...habit, user_id: USER_ID })
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
    .eq('user_id', USER_ID)
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
    .eq('user_id', USER_ID)
  if (error) throw error
}

export async function reorderHabits(db: DB, ids: string[]): Promise<void> {
  const updates = ids.map((id, position) => ({
    id,
    user_id: USER_ID,
    position,
    updated_at: new Date().toISOString(),
  }))
  const { error } = await db.from('habits').upsert(updates, { onConflict: 'id' })
  if (error) throw error
}

/* ── Habit Logs ─────────────────────────────────────────── */

export async function getLog(db: DB, habitId: string, date: string): Promise<HabitLog | null> {
  const { data, error } = await db
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId)
    .eq('date', date)
    .eq('user_id', USER_ID)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getLogs(db: DB, since: string): Promise<HabitLog[]> {
  const { data, error } = await db
    .from('habit_logs')
    .select('*')
    .eq('user_id', USER_ID)
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
      { habit_id: habitId, user_id: USER_ID, date, ...updates, updated_at: new Date().toISOString() },
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
    .eq('user_id', USER_ID)
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
      { user_id: USER_ID, date, ...updates, updated_at: new Date().toISOString() },
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
    .eq('user_id', USER_ID)
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function createTodo(db: DB, todo: TodoInsert): Promise<Todo> {
  const { data, error } = await db
    .from('todos')
    .insert({ ...todo, user_id: USER_ID })
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
    .eq('user_id', USER_ID)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTodo(db: DB, id: string): Promise<void> {
  const { error } = await db.from('todos').delete().eq('id', id).eq('user_id', USER_ID)
  if (error) throw error
}

export async function toggleTodo(db: DB, id: string, currentDone: boolean): Promise<Todo> {
  return updateTodo(db, id, { done: !currentDone })
}
