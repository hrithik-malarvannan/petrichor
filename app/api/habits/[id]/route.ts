import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { updateHabit, deleteHabit } from '@/lib/db'
import type { HabitUpdate } from '@/lib/types'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAuth()
  if (denied) return denied

  const { id } = await params
  const db = createAdminClient()
  try {
    const body: HabitUpdate = await req.json()
    const habit = await updateHabit(db, id, body)
    return NextResponse.json(habit)
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to update habit' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAuth()
  if (denied) return denied

  const { id } = await params
  const db = createAdminClient()
  try {
    await deleteHabit(db, id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to delete habit' }, { status: 500 })
  }
}
