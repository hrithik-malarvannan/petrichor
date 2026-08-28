import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { getCredentialById, updateCredentialCounter } from '@/lib/webauthnDb'
import { getRpID, getOrigin } from '@/lib/webauthn'
import { getAndClearChallenge } from '@/lib/webauthnChallenge'
import { createSessionToken, SESSION_COOKIE } from '@/lib/session'

export async function POST(req: NextRequest) {
  const expectedChallenge = await getAndClearChallenge()
  if (!expectedChallenge) {
    return NextResponse.json({ error: 'Login expired — try again' }, { status: 400 })
  }

  const response = await req.json()
  const db = createAdminClient()

  const stored = await getCredentialById(db, response.id)
  if (!stored) {
    return NextResponse.json({ error: 'Unrecognized device' }, { status: 400 })
  }

  try {
    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: getOrigin(req),
      expectedRPID: getRpID(req),
      credential: {
        id: stored.id,
        publicKey: isoBase64URL.toBuffer(stored.public_key),
        counter: stored.counter,
        transports: (stored.transports ?? undefined) as any,
      },
    })

    if (!verification.verified) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 401 })
    }

    await updateCredentialCounter(db, stored.id, verification.authenticationInfo.newCounter)

    const res = NextResponse.json({ ok: true })
    res.cookies.set(SESSION_COOKIE, createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 90,
    })
    return res
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Login failed' }, { status: 401 })
  }
}
