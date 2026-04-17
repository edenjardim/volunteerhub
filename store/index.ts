import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { User, Church, Notification, AppStore } from '@/types'

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        user:          null,
        church:        null,
        notifications: [],
        unreadCount:   0,
        sidebarOpen:   true,

        setUser: (user) => set({ user }),
        setChurch: (church) => set({ church }),

        setSidebarOpen: (open) => set({ sidebarOpen: open }),

        setNotifications: (notifications) => set({
          notifications,
          unreadCount: notifications.filter(n => !n.read).length,
        }),

        markNotificationRead: (id) =>
          set((state) => {
            const notifications = state.notifications.map(n =>
              n.id === id ? { ...n, read: true } : n
            )
            return { notifications, unreadCount: notifications.filter(n => !n.read).length }
          }),
      }),
      { name: 'volunteerhub-store', partialize: (s) => ({ sidebarOpen: s.sidebarOpen }) }
    )
  )
)

// ── Schedules store (per-session, no persist) ──────────────
interface ScheduleFilters {
  ministry_id?: string
  volunteer_id?: string
  event_id?: string
  status?: string
  view: 'list' | 'calendar' | 'ministry'
}

interface ScheduleStore {
  filters: ScheduleFilters
  setFilters: (f: Partial<ScheduleFilters>) => void
  resetFilters: () => void
}

const DEFAULT_FILTERS: ScheduleFilters = { view: 'list' }

export const useScheduleStore = create<ScheduleStore>((set) => ({
  filters:      DEFAULT_FILTERS,
  setFilters:   (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}))
