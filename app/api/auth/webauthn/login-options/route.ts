import { NextRequest, NextResponse } from 'next/server'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { getCredentials } from '@/lib/webauthnDb'
import { getRpID } from '@/lib/webauthn'
import { setChallenge } from '@/lib/webauthnChallenge'

export async function POST(req: NextRequest) {
  const db = createAdminClient()
  const existing = await getCredentials(db)

  if (existing.length === 0) {
    return NextResponse.json({ error: 'No fingerprint/Face ID set up yet' }, { status: 404 })
  }

  const options = await generateAuthenticationOptions({
    rpID: getRpID(req),
    allowCredentials: existing.map(c => ({
      id: c.id,
      transports: (c.transports ?? undefined) as any,
    })),
    userVerification: 'preferred',
  })

  await setChallenge(options.challenge)
  return NextResponse.json(options)
}
