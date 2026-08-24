import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'petrichor_session'

async function hmacHex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function isValidSession(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false

  const expected = await hmacHex(secret, payload)
  if (expected !== sig) return false

  const expires = Number(payload)
  if (!Number.isFinite(expires) || Date.now() > expires) return false

  return true
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthRoute = pathname === '/login' || pathname.startsWith('/api/auth')

  const secret = process.env.SESSION_SECRET
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const valid = secret ? await isValidSession(token, secret) : false

  if (!valid && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (valid && pathname === '/login') {
    return NextResponse.redirect(new URL('/today', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/).*)'],
}
