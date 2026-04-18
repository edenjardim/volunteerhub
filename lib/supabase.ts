import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Mantemos o nome createClient para não quebrar o projeto
export const createClientSupabase = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Alias para manter compatibilidade com o resto do sistema
export const createClient = createClientSupabase

// Singleton
let client: ReturnType<typeof createClientSupabase> | null = null

export const getSupabaseClient = () => {
  if (!client) client = createClientSupabase()
  return client
}

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const supabase = createClientSupabase()
  return supabase.auth.signInWithPassword({ email, password })
}

export const signUp = async (
  email: string,
  password: string,
  metadata?: Record<string, string>
) => {
  const supabase = createClientSupabase()
  return supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  })
}

export const signOut = async () => {
  const supabase = createClientSupabase()
  return supabase.auth.signOut()
}

export const signInWithGoogle = async () => {
  const supabase = createClientSupabase()
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
}

export const getSession = async () => {
  const supabase = createClientSupabase()
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
  const supabase = createClientSupabase()

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const deleteFile = async (bucket: string, path: string) => {
  const supabase = createClientSupabase()
  return supabase.storage.from(bucket).remove([path])
}
