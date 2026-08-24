import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { getLogs } from '@/lib/db'

export async function GET(req: NextRequest) {
  const denied = await requireAuth()
  if (denied) return denied

  const since = req.nextUrl.searchParams.get('since')
  if (!since) return NextResponse.json({ error: 'Missing since param' }, { status: 400 })

  const db = createAdminClient()
  try {
    const logs = await getLogs(db, since)
    return NextResponse.json(logs)
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to fetch logs' }, { status: 500 })
  }
}
