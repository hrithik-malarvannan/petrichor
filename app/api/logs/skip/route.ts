import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { getLog, skipLog } from '@/lib/db'

export async function POST(req: NextRequest) {
  const denied = await requireAuth()
  if (denied) return denied

  const db = createAdminClient()
  try {
    const { habitId, date }: { habitId: string; date: string } = await req.json()
    const current = await getLog(db, habitId, date)
    const updated = await skipLog(db, habitId, date, !!current?.skipped)
    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to skip log' }, { status: 500 })
  }
}
