import { NextRequest, NextResponse } from 'next/server'
import { checkPin, createSessionToken, SESSION_COOKIE } from '@/lib/session'

export async function POST(req: NextRequest) {
  const { pin } = await req.json().catch(() => ({ pin: '' }))

  if (typeof pin !== 'string' || !checkPin(pin)) {
    return NextResponse.json({ ok: false, error: 'Incorrect PIN' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 90, // 90 days
  })
  return res
}
