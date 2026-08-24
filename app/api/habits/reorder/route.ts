import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { reorderHabits } from '@/lib/db'

export async function POST(req: NextRequest) {
  const denied = await requireAuth()
  if (denied) return denied

  const db = createAdminClient()
  try {
    const { ids }: { ids: string[] } = await req.json()
    await reorderHabits(db, ids)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to reorder habits' }, { status: 500 })
  }
}
