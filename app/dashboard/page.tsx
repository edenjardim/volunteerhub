'use client'

import { useState } from 'react'
import { Users, CheckCircle, BarChart3, CalendarDays, ArrowUpRight, Star, Bell, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppStore } from '@/store'
import { useSchedules, useVolunteers, useNotifications } from '@/hooks'
import { formatDayLabel, formatDate, getInitials, getAvatarColor, getPresenceColor, getPointsTier, scheduleStatusLabel } from '@/lib/utils'

// ── Stat Card ───────────────────────────────────────────────
const StatCard = ({ value, label, icon: Icon, change, changePositive, color, bg }: {
  value: string | number; label: string; icon: React.ElementType
  change?: string; changePositive?: boolean; color: string; bg: string
}) => (
  <div className="card">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-3xl font-display font-extrabold text-[#020617] tracking-tight leading-none">{value}</div>
        <div className="text-sm text-muted font-medium mt-1">{label}</div>
        {change && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${changePositive ? 'text-success' : 'text-danger'}`}>
            <ArrowUpRight size={12} className={changePositive ? '' : 'rotate-180'} />
            {change}
          </div>
        )}
      </div>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: bg }}>
        <Icon size={20} color={color} />
      </div>
    </div>
  </div>
)

// ── Progress bar ────────────────────────────────────────────
const Bar = ({ value, color }: { value: number; color: string }) => (
  <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
  </div>
)

export default function DashboardPage() {
  const { user } = useAppStore()
  const [checkedIn, setCheckedIn] = useState(false)
  const { data } = useSchedules({ limit: '5' })
const schedules = data ?? []
  const { data: volunteers = [] } = useVolunteers({ limit: '5', sort: 'points' })
  const { notifications } = useNotifications()

  const nextSchedule = schedules?.[0]

  const handleCheckIn = () => {
    setCheckedIn(!checkedIn)
    toast.success(checkedIn ? 'Check-in cancelado.' : '📍 Check-in realizado com sucesso!')
  }

  const handleConfirmSchedule = (id: string) => {
    toast.success('✅ Presença confirmada!')
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#0F172A] p-7">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/10 -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-secondary/20 translate-y-1/2 blur-xl" />
        <div className="relative">
          <p className="text-xs text-white/40 font-bold tracking-[1.5px] uppercase mb-1">Bem-vindo de volta</p>
          <h1 className="font-display text-2xl font-extrabold text-white tracking-tight mb-1">
            {user?.name || 'Olá!'} 👋
          </h1>
          <p className="text-white/55 text-sm">
            Você tem <span className="text-blue-300 font-semibold">3 escalas</span> esta semana
          </p>
          <div className="flex gap-3 mt-5">
            {[
              { label: 'PONTOS',   value: user?.points ?? 1240 },
              { label: 'PRESENÇA', value: `${user?.presence_rate ?? 96}%` },
              { label: 'RANKING',  value: '#1' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5">
                <div className="text-lg font-display font-extrabold text-white">{value}</div>
                <div className="text-[10px] text-white/40 font-bold tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard value="87"  label="Total de Voluntários" icon={Users}        change="+4 este mês" changePositive color="#2563EB" bg="#EFF6FF" />
        <StatCard value="64"  label="Ativos este Mês"      icon={CheckCircle}  change="+6 vs. anterior" changePositive color="#16A34A" bg="#F0FDF4" />
        <StatCard value="91%" label="Taxa de Presença"      icon={BarChart3}    change="+2.1%" changePositive color="#7C3AED" bg="#F5F3FF" />
        <StatCard value="12"  label="Eventos este Mês"     icon={CalendarDays} color="#F59E0B" bg="#FFFBEB" />
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
        {/* Left */}
        <div className="space-y-5">
          {/* Upcoming schedules */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#020617]">Próximas Escalas</h2>
              <button className="btn btn-ghost text-xs py-1.5 px-3">Ver todas</button>
            </div>
            <div className="space-y-0.5">
              {(schedules.length ? schedules : [
                { id: '1', event: { title: 'Culto Dominical Manhã' }, event_date: '2025-01-19T09:00', ministry: { name: 'Louvor', color: '#7C3AED' }, role: 'Vocal Principal', status: 'confirmed' },
                { id: '2', event: { title: 'Culto Dominical Noite' }, event_date: '2025-01-19T19:00', ministry: { name: 'Mídia',  color: '#0891B2' }, role: 'Operador de Som', status: 'pending' },
                { id: '3', event: { title: 'Culto de Quarta'      }, event_date: '2025-01-22T19:30', ministry: { name: 'Intercessão', color: '#DC2626' }, role: 'Intercessor', status: 'confirmed' },
              ] as any[]).map((s) => (
                <div key={s.id} className="flex items-center gap-3.5 py-3.5 border-b border-[#F8FAFC] last:border-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${s.ministry?.color || '#2563EB'}18` }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: s.ministry?.color || '#2563EB' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#020617] truncate">{s.event?.title}</div>
                    <div className="text-xs text-muted mt-0.5">{formatDayLabel(s.event_date)} • {s.role}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge ${s.status === 'confirmed' ? 'bg-[#F0FDF4] text-success' : 'bg-[#FFFBEB] text-amber-700'}`}>
                      {s.status === 'confirmed' ? '✓ Confirmado' : '⏳ Pendente'}
                    </span>
                    {s.status === 'pending' && (
                      <button onClick={() => handleConfirmSchedule(s.id)} className="btn btn-primary text-xs py-1.5 px-3">
                        Confirmar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Swap requests */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#020617] flex items-center gap-2">
                <RefreshCw size={16} className="text-accent" />
                Solicitações de Troca
              </h2>
              <span className="badge bg-[#FEF2F2] text-danger">3 pendentes</span>
            </div>
            {[
              { name: 'João Santos',   from: 'Culto Dom. Manhã', to: 'Lucas Ferreira', date: '19 Jan', initials: 'JS', color: '#2563EB' },
              { name: 'Ana Lima',      from: 'Culto de Quarta',  to: '—',              date: '22 Jan', initials: 'AL', color: '#16A34A' },
            ].map((swap, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-[#F8FAFC] last:border-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: swap.color }}>
                  {swap.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{swap.name}</div>
                  <div className="text-xs text-muted">{swap.from} • {swap.date}</div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => toast.success('Troca aprovada!')} className="btn btn-success text-xs py-1 px-2.5">Aprovar</button>
                  <button onClick={() => toast('Troca rejeitada.')} className="btn btn-danger text-xs py-1 px-2.5">Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Check-in card */}
          {nextSchedule || true ? (
            <div className="rounded-xl bg-gradient-to-br from-secondary to-accent p-5 text-white">
              <div className="text-[10px] font-bold tracking-[1.5px] opacity-70 mb-2 uppercase">Próxima Escala</div>
              <div className="text-base font-bold mb-1">Culto Dominical Manhã</div>
              <div className="text-sm opacity-75 mb-4">Dom, 19 Jan às 09:00</div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl p-3 mb-4 backdrop-blur-sm border border-white/10">
                <span className="text-lg">🎵</span>
                <div>
                  <div className="text-sm font-semibold">Louvor e Adoração</div>
                  <div className="text-xs opacity-70">Vocal Principal</div>
                </div>
              </div>
              <button
                onClick={handleCheckIn}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${
                  checkedIn
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'bg-white text-secondary hover:bg-blue-50'
                }`}
              >
                {checkedIn ? '✅ Check-in Realizado' : '📍 Fazer Check-in'}
              </button>
            </div>
          ) : null}

          {/* Notifications */}
          <div className="card">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-[#020617] flex items-center gap-2"><Bell size={15} className="text-secondary" /> Notificações</h3>
              <span className="badge bg-[#FEF2F2] text-danger">2 novas</span>
            </div>
            {[
              { msg: 'Nova escala publicada para 19 de Janeiro', time: '2h atrás', read: false },
              { msg: 'João Santos solicitou troca de escala', time: '4h atrás', read: false },
              { msg: 'Lembrete: Culto Dominical amanhã às 09h', time: '1d atrás', read: true },
              { msg: 'Novo feedback recebido de Maria Oliveira', time: '2d atrás', read: true },
            ].map((n, i) => (
              <div key={i} className={`flex gap-2.5 py-2.5 border-b border-[#F8FAFC] last:border-0 ${n.read ? 'opacity-50' : ''}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-[#CBD5E1]' : 'bg-secondary'}`} />
                <div>
                  <div className={`text-xs leading-relaxed ${n.read ? 'text-muted' : 'text-[#334155] font-semibold'}`}>{n.msg}</div>
                  <div className="text-[11px] text-muted/70 mt-0.5">{n.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Top volunteers */}
          <div className="card">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-[#020617]">Top Voluntários</h3>
              <Star size={15} className="text-amber-400 fill-amber-400" />
            </div>
            {[
              { name: 'Maria Oliveira', pts: 1580, pct: 98, color: '#7C3AED' },
              { name: 'João Santos',    pts: 1420, pct: 94, color: '#2563EB' },
              { name: 'Ana Lima',       pts: 1380, pct: 92, color: '#0891B2' },
              { name: 'Lucas Ferreira', pts: 1240, pct: 96, color: '#16A34A' },
              { name: 'Clara Mendes',   pts: 1190, pct: 89, color: '#F59E0B' },
            ].map((v, i) => (
              <div key={v.name} className="flex items-center gap-2.5 mb-3 last:mb-0">
                <div className={`w-5 text-xs font-bold text-center ${i < 3 ? ['text-amber-500','text-slate-400','text-orange-400'][i] : 'text-[#CBD5E1]'}`}>{i + 1}</div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: v.color }}>
                  {getInitials(v.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate">{v.name}</div>
                  <Bar value={v.pct} color={v.color} />
                </div>
                <div className="text-xs font-bold text-muted w-14 text-right">{v.pts}pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
