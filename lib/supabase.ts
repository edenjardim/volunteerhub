import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

// Cliente singleton do Supabase para o browser
let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}

// Alias para compatibilidade
export const createClient = getSupabaseClient

// ── Auth Helpers ──────────────────────────────────────────────
export const signIn = async (email: string, password: string) => {
  const supabase = getSupabaseClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export const signUp = async (
  email: string,
  password: string,
  metadata?: Record<string, any>
) => {
  const supabase = getSupabaseClient()
  return supabase.auth.signUp({
    email,
    password,
    options: { 
      data: metadata,
      emailRedirectTo: `${window.location.origin}/auth/callback`
    },
  })
}

export const signOut = async () => {
  const supabase = getSupabaseClient()
  return supabase.auth.signOut()
}

export const signInWithGoogle = async () => {
  const supabase = getSupabaseClient()
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { 
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    },
  })
}

export const getSession = async () => {
  const supabase = getSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export const getUser = async () => {
  const supabase = getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ── Storage Helpers ────────────────────────────────────────────
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
) => {
  const supabase = getSupabaseClient()

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const deleteFile = async (bucket: string, path: string) => {
  const supabase = getSupabaseClient()
  return supabase.storage.from(bucket).remove([path])
}

// ── Database Helpers (substitui a API REST) ────────────────────

// Helper genérico para queries com error handling
export const handleSupabaseError = <T>(
  result: { data: T | null; error: any }
): T => {
  if (result.error) {
    console.error('Supabase error:', result.error)
    throw new Error(result.error.message || 'Erro ao acessar banco de dados')
  }
  return result.data as T
}
