import { createHmac, timingSafeEqual } from 'crypto'

export const SESSION_COOKIE = 'petrichor_session'
const SESSION_DAYS = 90

function secret() {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error('SESSION_SECRET is not set in .env.local')
  return s
}

function sign(value: string): string {
  return createHmac('sha256', secret()).update(value).digest('hex')
}

/** Creates a signed session token good for SESSION_DAYS from now. */
export function createSessionToken(): string {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  const payload = String(expires)
  const sig = sign(payload)
  return `${payload}.${sig}`
}

/** Returns true if the token is well-formed, correctly signed, and not expired. */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false

  const expected = sign(payload)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false

  const expires = Number(payload)
  if (!Number.isFinite(expires) || Date.now() > expires) return false

  return true
}

export function checkPin(submitted: string): boolean {
  const real = process.env.APP_PIN
  if (!real) throw new Error('APP_PIN is not set in .env.local')
  if (submitted.length !== real.length) return false
  return timingSafeEqual(Buffer.from(submitted), Buffer.from(real))
}
