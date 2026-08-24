import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { getDaySummaries, upsertDaySummary } from '@/lib/db'

export async function GET(req: NextRequest) {
  const denied = await requireAuth()
  if (denied) return denied

  const since = req.nextUrl.searchParams.get('since')
  if (!since) return NextResponse.json({ error: 'Missing since param' }, { status: 400 })

  const db = createAdminClient()
  try {
    const summaries = await getDaySummaries(db, since)
    return NextResponse.json(summaries)
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to fetch summaries' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth()
  if (denied) return denied

  const db = createAdminClient()
  try {
    const { date, mood, journal }: { date: string; mood: number | null; journal: string } = await req.json()
    const summary = await upsertDaySummary(db, date, { mood, journal })
    return NextResponse.json(summary)
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to save summary' }, { status: 500 })
  }
}
