import { createClient } from '@supabase/supabase-js'

/* Server-only. Never import this from a client component or a hook —
   the service role key must never reach the browser bundle. */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export function createAdminClient() {
  return createClient(URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/* The one fixed account all data belongs to — this is a single-user app. */
export const USER_ID = process.env.SUPABASE_USER_ID!
