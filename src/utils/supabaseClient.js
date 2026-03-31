/**
 * Supabase client for sending experiment data on Finish.
 * Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment (e.g. Netlify).
 */

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client = null

export function getSupabase() {
  if (!url || !anonKey) return null
  if (client) return client
  try {
    client = createClient(url, anonKey)
    return client
  } catch (e) {
    console.warn('Supabase not available:', e.message)
    return null
  }
}

export function isSupabaseConfigured() {
  return Boolean(url && anonKey)
}
