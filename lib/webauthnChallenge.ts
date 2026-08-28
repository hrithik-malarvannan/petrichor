import { cookies } from 'next/headers'

const CHALLENGE_COOKIE = 'webauthn_challenge'

export async function setChallenge(challenge: string) {
  const store = await cookies()
  store.set(CHALLENGE_COOKIE, challenge, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 300, // 5 minutes — plenty for a biometric prompt
  })
}

/** Reads the challenge and immediately clears it — one-time use. */
export async function getAndClearChallenge(): Promise<string | undefined> {
  const store = await cookies()
  const val = store.get(CHALLENGE_COOKIE)?.value
  store.set(CHALLENGE_COOKIE, '', { path: '/', maxAge: 0 })
  return val
}
