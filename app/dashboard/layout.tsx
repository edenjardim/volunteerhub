'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Calendar, Users, Grid3X3,
  CalendarDays, BarChart3, Settings, Bell, Menu, X,
  LogOut, ChevronRight,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { useAuth, useNotifications, useIsMobile } from '@/hooks'
import { signOut } from '@/lib/supabase'
import { getInitials, getAvatarColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

const NAV = [
  { section: 'PRINCIPAL', items: [
    { href: '/dashboard',            label: 'Dashboard',     icon: LayoutDashboard },
    { href: '/dashboard/schedules',  label: 'Escalas',       icon: Calendar },
    { href: '/dashboard/volunteers', label: 'Voluntários',   icon: Users },
    { href: '/dashboard/ministries', label: 'Ministérios',   icon: Grid3X3 },
  ]},
  { section: 'GESTÃO', items: [
    { href: '/dashboard/events',     label: 'Eventos',       icon: CalendarDays },
    { href: '/dashboard/reports',    label: 'Relatórios',    icon: BarChart3 },
  ]},
  { section: 'CONTA', items: [
    { href: '/dashboard/settings',   label: 'Configurações', icon: Settings },
  ]},
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()
  const { notifications, markNotificationRead } = useNotifications()
  const { sidebarOpen, setSidebarOpen, unreadCount } = useAppStore()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!isAuthenticated && user === null) {
      // Give time for session to load
      const t = setTimeout(() => router.push('/auth/login'), 1000)
      return () => clearTimeout(t)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [pathname, isMobile])

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar backdrop (mobile) */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 bottom-0 w-[260px] bg-[#0F172A] z-[100] flex flex-col',
        'shadow-[4px_0_20px_rgba(0,0,0,0.15)] transition-transform duration-300',
        isMobile && !sidebarOpen && '-translate-x-full',
        isMobile && sidebarOpen  && 'translate-x-0',
        !isMobile && 'translate-x-0',
      )}>
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-lg shadow">
              ⛪
            </div>
            <div>
              <div className="font-display text-lg font-extrabold text-white tracking-tight">VolunteerHub</div>
              <div className="text-[10px] text-white/35 font-semibold tracking-widest">GESTÃO DE VOLUNTÁRIOS</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-2 overflow-y-auto scrollbar-hide">
          {NAV.map((section) => (
            <div key={section.section}>
              <div className="px-3 py-2 mt-2 text-[10px] font-bold text-white/30 tracking-[1.5px]">
                {section.section}
              </div>
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'sidebar-link my-0.5',
                      active && 'sidebar-link-active',
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* User profile */}
        <div className="p-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 group cursor-pointer hover:bg-white/10 transition-colors">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: user ? getAvatarColor(user.name) : '#2563EB' }}
            >
              {user ? getInitials(user.name) : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#F1F5F9] truncate">{user?.name || 'Carregando...'}</div>
              <div className="text-[11px] text-white/35 font-medium capitalize">{user?.role || 'voluntário'}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white transition-all"
              title="Sair"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className={cn(
        'flex-1 flex flex-col min-h-screen transition-[margin] duration-300',
        !isMobile && 'ml-[260px]',
      )}>
        {/* Top Header */}
        <header className="sticky top-0 z-50 h-16 bg-[rgba(248,250,252,0.9)] backdrop-blur-xl border-b border-[#E2E8F0] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="btn btn-ghost p-2 rounded-lg"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            {/* Breadcrumb */}
            <div>
              <div className="text-xs text-muted font-medium">{user?.church_id ? 'Minha Igreja' : 'VolunteerHub'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button className="btn btn-ghost p-2 rounded-xl">
                <Bell size={18} className="text-muted" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-[#F8FAFC]" />
                )}
              </button>
            </div>

            {/* User chip */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] cursor-pointer hover:shadow-card transition-shadow">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                style={{ background: user ? getAvatarColor(user.name) : '#2563EB' }}
              >
                {user ? getInitials(user.name) : '?'}
              </div>
              <span className="text-sm font-semibold text-[#020617] max-w-[120px] truncate">
                {user?.name?.split(' ')[0] || '...'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
