'use client'

import { useEffect } from 'react'
import { useRouter }  from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router   = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/dashboard')
      } else {
        router.replace('/auth/login')
      }
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-accent mb-4 shadow-lg">
          <span className="text-2xl animate-pulse">⛪</span>
        </div>
        <p className="text-sm text-muted font-medium">Autenticando...</p>
      </div>
    </div>
  )
}
