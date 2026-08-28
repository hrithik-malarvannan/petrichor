import type { SupabaseClient } from '@supabase/supabase-js'
import { USER_ID } from './supabaseAdmin'

export interface StoredCredential {
  id: string
  user_id: string
  public_key: string
  counter: number
  device_name: string | null
  transports: string[] | null
  created_at: string
}

export async function getCredentials(db: SupabaseClient): Promise<StoredCredential[]> {
  const { data, error } = await db.from('webauthn_credentials').select('*').eq('user_id', USER_ID)
  if (error) throw error
  return data
}

export async function getCredentialById(db: SupabaseClient, id: string): Promise<StoredCredential | null> {
  const { data, error } = await db
    .from('webauthn_credentials')
    .select('*')
    .eq('id', id)
    .eq('user_id', USER_ID)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function saveCredential(
  db: SupabaseClient,
  cred: { id: string; publicKey: string; counter: number; deviceName?: string; transports?: string[] },
): Promise<void> {
  const { error } = await db.from('webauthn_credentials').insert({
    id: cred.id,
    user_id: USER_ID,
    public_key: cred.publicKey,
    counter: cred.counter,
    device_name: cred.deviceName ?? null,
    transports: cred.transports ?? null,
  })
  if (error) throw error
}

export async function updateCredentialCounter(db: SupabaseClient, id: string, counter: number): Promise<void> {
  const { error } = await db.from('webauthn_credentials').update({ counter }).eq('id', id).eq('user_id', USER_ID)
  if (error) throw error
}

export async function deleteCredential(db: SupabaseClient, id: string): Promise<void> {
  const { error } = await db.from('webauthn_credentials').delete().eq('id', id).eq('user_id', USER_ID)
  if (error) throw error
}
