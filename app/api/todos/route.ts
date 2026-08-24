import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { getTodos, createTodo } from '@/lib/db'
import type { TodoInsert } from '@/lib/types'

export async function GET() {
  const denied = await requireAuth()
  if (denied) return denied

  const db = createAdminClient()
  try {
    const todos = await getTodos(db)
    return NextResponse.json(todos)
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to fetch todos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth()
  if (denied) return denied

  const db = createAdminClient()
  try {
    const body: TodoInsert = await req.json()
    const todo = await createTodo(db, body)
    return NextResponse.json(todo)
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to create todo' }, { status: 500 })
  }
}
