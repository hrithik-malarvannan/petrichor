import { NextRequest, NextResponse } from 'next/server'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
import { requireAuth } from '@/lib/apiAuth'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { saveCredential } from '@/lib/webauthnDb'
import { getRpID, getOrigin } from '@/lib/webauthn'
import { getAndClearChallenge } from '@/lib/webauthnChallenge'

export async function POST(req: NextRequest) {
  const denied = await requireAuth()
  if (denied) return denied

  const expectedChallenge = await getAndClearChallenge()
  if (!expectedChallenge) {
    return NextResponse.json({ error: 'Registration expired — try again' }, { status: 400 })
  }

  const { response, deviceName } = await req.json()

  try {
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: getOrigin(req),
      expectedRPID: getRpID(req),
    })

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
    }

    const { credential } = verification.registrationInfo
    const db = createAdminClient()
    await saveCredential(db, {
      id: credential.id,
      publicKey: isoBase64URL.fromBuffer(credential.publicKey),
      counter: credential.counter,
      deviceName: deviceName || 'Unnamed device',
      transports: credential.transports,
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Registration failed' }, { status: 400 })
  }
}
