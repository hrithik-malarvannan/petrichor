import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { getHabits, createHabit } from '@/lib/db'
import type { HabitInsert } from '@/lib/types'

export async function GET() {
  const denied = await requireAuth()
  if (denied) return denied

  const db = createAdminClient()
  try {
    const habits = await getHabits(db)
    return NextResponse.json(habits)
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to fetch habits' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth()
  if (denied) return denied

  const db = createAdminClient()
  try {
    const body: HabitInsert = await req.json()
    const habit = await createHabit(db, body)
    return NextResponse.json(habit)
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to create habit' }, { status: 500 })
  }
}
