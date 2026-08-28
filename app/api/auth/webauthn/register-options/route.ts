import { NextRequest, NextResponse } from 'next/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { isoUint8Array } from '@simplewebauthn/server/helpers'
import { requireAuth } from '@/lib/apiAuth'
import { createAdminClient, USER_ID } from '@/lib/supabaseAdmin'
import { getCredentials } from '@/lib/webauthnDb'
import { getRpID, RP_NAME } from '@/lib/webauthn'
import { setChallenge } from '@/lib/webauthnChallenge'

export async function POST(req: NextRequest) {
  const denied = await requireAuth()
  if (denied) return denied

  const db = createAdminClient()
  const existing = await getCredentials(db)

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: getRpID(req),
    userName: 'hrithik',
    userID: isoUint8Array.fromUTF8String(USER_ID),
    attestationType: 'none',
    excludeCredentials: existing.map(c => ({
      id: c.id,
      transports: (c.transports ?? undefined) as any,
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
      authenticatorAttachment: 'platform', // biases toward built-in Face ID / fingerprint / Windows Hello
    },
  })

  await setChallenge(options.challenge)
  return NextResponse.json(options)
}
