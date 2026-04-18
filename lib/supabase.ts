import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Cliente principal (browser)
export const createClientInstance = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Singleton
let client: ReturnType<typeof createClientInstance> | null = null

export const getSupabaseClient = () => {
  if (!client) client = createClientInstance()
  return client
}

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const supabase = createClientInstance()
  return supabase.auth.signInWithPassword({ email, password })
}

export const signUp = async (
  email: string,
  password: string,
  metadata?: Record<string, string>
) => {
  const supabase = createClientInstance()
  return supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  })
}

export const signOut = async () => {
  const supabase = createClientInstance()
  return supabase.auth.signOut()
}

export const signInWithGoogle = async () => {
  const supabase = createClientInstance()
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
}

export const getSession = async () => {
  const supabase = createClientInstance()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

// Storage helpers
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
) => {
  const supabase = createClientInstance()

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const deleteFile = async (bucket: string, path: string) => {
  const supabase = createClientInstance()
  return supabase.storage.from(bucket).remove([path])
}
