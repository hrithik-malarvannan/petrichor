import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { saveNote } from '@/lib/db'

export async function POST(req: NextRequest) {
  const denied = await requireAuth()
  if (denied) return denied

  const db = createAdminClient()
  try {
    const { habitId, date, note }: { habitId: string; date: string; note: string } = await req.json()
    const updated = await saveNote(db, habitId, date, note)
    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to save note' }, { status: 500 })
  }
}
