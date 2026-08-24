import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifySessionToken, SESSION_COOKIE } from './session'

/** Returns true if the request has a valid session cookie. */
export async function hasValidSession(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  return verifySessionToken(token)
}

/** Use at the top of any API route: `const denied = await requireAuth(); if (denied) return denied` */
export async function requireAuth(): Promise<NextResponse | null> {
  if (await hasValidSession()) return null
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
