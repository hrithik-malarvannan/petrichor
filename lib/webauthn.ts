import type { NextRequest } from 'next/server'

export const RP_NAME = 'Petrichor'

export function getRpID(req: NextRequest): string {
  const host = req.headers.get('host') || 'localhost:3000'
  return host.split(':')[0]
}

export function getOrigin(req: NextRequest): string {
  const host = req.headers.get('host') || 'localhost:3000'
  const proto = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}
