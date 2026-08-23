/* ─── Shared utility functions ───────────────────────────── */

import type { Habit, HabitLog, LogMap, SummaryMap, Todo, TodoState } from './types'

/* Date helpers */
export const todayStr  = (): string => new Date().toISOString().slice(0, 10)
export const daysAgo   = (n: number): string => {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10)
}
export const buildGrid = (days = 91): string[] =>
  Array.from({ length: days }, (_, i) => daysAgo(days - 1 - i))

export const todayDow = (): number => new Date().getDay()

export function isScheduledToday(habit: Habit): boolean {
  return !habit.schedule_days || habit.schedule_days.includes(todayDow())
}

export function isScheduledOn(habit: Habit, dow: number): boolean {
  return !habit.schedule_days || habit.schedule_days.includes(dow)
}

/* Streak — count consecutive done days ending today */
export function streak(logs: LogMap, habitId: string): number {
  let s = 0
  const d = new Date()
  while (logs[d.toISOString().slice(0, 10)]?.[habitId]?.done) {
    s++
    d.setDate(d.getDate() - 1)
  }
  return s
}

/* Completion rate over last N days */
export function rate(logs: LogMap, habitId: string, days = 91): number {
  const grid = buildGrid(days)
  return Math.round(grid.filter(d => logs[d]?.[habitId]?.done).length / days * 100)
}

/* Completions this week */
export function weekDone(logs: LogMap, habitId: string): number {
  return Array.from({ length: 7 }, (_, i) => daysAgo(i))
    .filter(d => logs[d]?.[habitId]?.done).length
}

/* Convert flat DB rows → nested LogMap */
export function logsToMap(rows: HabitLog[]): LogMap {
  const map: LogMap = {}
  for (const row of rows) {
    if (!map[row.date]) map[row.date] = {}
    map[row.date][row.habit_id] = {
      done:    row.done,
      skipped: row.skipped,
      note:    row.note,
    }
  }
  return map
}

/* Convert flat Todo rows → TodoState */
export function todosToState(rows: Todo[]): TodoState {
  const state: TodoState = { daily: {}, general: [] }
  for (const todo of rows) {
    if (todo.date === null) {
      state.general.push(todo)
    } else {
      if (!state.daily[todo.date]) state.daily[todo.date] = []
      state.daily[todo.date].push(todo)
    }
  }
  return state
}

/* Build chart data — 30 days line chart for a single habit */
export function buildLineData(logs: LogMap, habitId: string) {
  return Array.from({ length: 30 }, (_, i) => daysAgo(29 - i)).map(day => ({
    date: day.slice(5),
    done: logs[day]?.[habitId]?.done ? 1 : 0,
  }))
}

/* Build weekly bar chart — last 8 weeks for multiple habits */
export function buildWeekBarData(logs: LogMap, habits: Habit[]) {
  return Array.from({ length: 8 }, (_, wi) => {
    const weekDays = Array.from({ length: 7 }, (_, i) => daysAgo(wi * 7 + i))
    const obj: Record<string, string | number> = { label: wi === 0 ? 'This wk' : `${wi + 1}w ago` }
    habits.forEach(h => {
      obj[h.id] = weekDays.filter(d => logs[d]?.[h.id]?.done).length
    })
    return obj
  }).reverse()
}
