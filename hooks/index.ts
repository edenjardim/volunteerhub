import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { usersApi, schedulesApi, ministriesApi, eventsApi, notificationsApi, reportsApi } from '@/lib/api'
import { useAppStore } from '@/store'
import type { User, Ministry, Event, Schedule, Notification, PresenceReport } from '@/types'

// ── Auth ───────────────────────────────────────────────────
export const useAuth = () => {
  const { user, setUser, setChurch } = useAppStore()
  const router   = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { setUser(null); return }
      loadUser(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { setUser(null); router.push('/auth/login'); return }
      loadUser(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUser = async (authId: string) => {
    try {
      const { data } = await usersApi.get(authId)
      setUser(data)
    } catch {
      // User not yet in DB (new signup)
    }
  }

  return { user, isAuthenticated: !!user }
}

// ── Data fetching with loading + error ─────────────────────
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data,    setData]    = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fn()
      setData(result)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao carregar dados'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => { load() }, [load])

  return { data, loading, error, refetch: load }
}

// ── Volunteers ─────────────────────────────────────────────
export const useVolunteers = (params?: Record<string, string>) =>
  useAsync(() => usersApi.list(params).then(r => r.data.data), [JSON.stringify(params)])

export const useVolunteer = (id: string) =>
  useAsync(() => usersApi.get(id).then(r => r.data), [id])

// ── Ministries ─────────────────────────────────────────────
export const useMinistries = () =>
  useAsync(() => ministriesApi.list().then(r => r.data.data), [])

// ── Events ─────────────────────────────────────────────────
export const useEvents = (params?: Record<string, string>) =>
  useAsync(() => eventsApi.list(params).then(r => r.data.data), [JSON.stringify(params)])

// ── Schedules ──────────────────────────────────────────────
export const useSchedules = (params?: Record<string, string>) =>
  useAsync(() => schedulesApi.list(params).then(r => r.data.data), [JSON.stringify(params)])

// ── Notifications (realtime) ───────────────────────────────
export const useNotifications = () => {
  const { notifications, setNotifications, markNotificationRead, user } = useAppStore()
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    // Initial load
    notificationsApi.list().then(r => setNotifications(r.data.data))

    // Realtime subscription
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        const n = payload.new as Notification
        toast(n.title, { icon: '🔔' })
        setNotifications([n, ...notifications])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user?.id])

  return { notifications, markNotificationRead }
}

// ── Reports ────────────────────────────────────────────────
export const usePresenceReport = (params?: Record<string, string>) =>
  useAsync(() => reportsApi.presence(params).then(r => r.data), [JSON.stringify(params)])

// ── Debounce ───────────────────────────────────────────────
export const useDebounce = <T>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// ── Mobile detection ───────────────────────────────────────
export const useIsMobile = (breakpoint = 900) => {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return isMobile
}

// ── Confirm dialog ─────────────────────────────────────────
export const useConfirm = () => {
  const [open,    setOpen]    = useState(false)
  const [message, setMessage] = useState('')
  const resolveRef = useRef<(v: boolean) => void>(() => {})

  const confirm = (msg: string) => new Promise<boolean>(resolve => {
    setMessage(msg)
    setOpen(true)
    resolveRef.current = resolve
  })

  const onConfirm = () => { setOpen(false); resolveRef.current(true) }
  const onCancel  = () => { setOpen(false); resolveRef.current(false) }

  return { open, message, confirm, onConfirm, onCancel }
}
