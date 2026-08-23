import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  return createBrowserClient<Database>(URL, ANON)
}
