import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { updateTodo, deleteTodo } from '@/lib/db'
import type { TodoUpdate } from '@/lib/types'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAuth()
  if (denied) return denied

  const { id } = await params
  const db = createAdminClient()
  try {
    const body: TodoUpdate = await req.json()
    const todo = await updateTodo(db, id, body)
    return NextResponse.json(todo)
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to update todo' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAuth()
  if (denied) return denied

  const { id } = await params
  const db = createAdminClient()
  try {
    await deleteTodo(db, id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to delete todo' }, { status: 500 })
  }
}
