import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

// Browser client (used in components)
export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Singleton for non-component usage
let client: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!client) client = createClient()
  return client
}

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const supabase = createClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export const signUp = async (email: string, password: string, metadata?: Record<string, string>) => {
  const supabase = createClient()
  return supabase.auth.signUp({ email, password, options: { data: metadata } })
}

export const signOut = async () => {
  const supabase = createClient()
  return supabase.auth.signOut()
}

export const signInWithGoogle = async () => {
  const supabase = createClient()
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
}

export const getSession = async () => {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Storage helpers
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const supabase = createClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
  return urlData.publicUrl
}

export const deleteFile = async (bucket: string, path: string) => {
  const supabase = createClient()
  return supabase.storage.from(bucket).remove([path])
}
