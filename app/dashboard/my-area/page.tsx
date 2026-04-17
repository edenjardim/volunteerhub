'use client'

// ── Área do Voluntário — Visão mobile-first
// Acessada por voluntários comuns (role = 'volunteer')

import { useState } from 'react'
import { CheckCircle, RefreshCw, CalendarOff, BookOpen, Star, ChevronRight, Bell, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppStore } from '@/store'
import { getInitials, getAvatarColor, getPointsTier, DAY_LABELS, formatDayLabel } from '@/lib/utils'
import { Card, Badge, Button, ProgressBar, Modal, Toggle, Tabs } from '@/components/ui'

const MOCK_MY_SCHEDULES = [
  { id: '1', event: 'Culto Dominical Manhã', date: '2025-01-19T09:00', ministry: 'Louvor e Adoração', role: 'Vocal Principal',  color: '#7C3AED', status: 'pending'   },
  { id: '2', event: 'Culto Dominical Noite', date: '2025-01-19T19:00', ministry: 'Mídia e Tecnologia', role: 'Operador de Som', color: '#0891B2', status: 'confirmed' },
  { id: '3', event: 'Culto de Quarta',       date: '2025-01-22T19:30', ministry: 'Intercessão',        role: 'Intercessor',    color: '#DC2626', status: 'confirmed' },
]

const MOCK_MATERIALS = [
  { type: 'chord',   title: 'Grandes e Maravilhosas', meta: 'Tom: G',          icon: '🎵' },
  { type: 'chord',   title: 'Santo Espírito',          meta: 'Tom: C',          icon: '🎵' },
  { type: 'youtube', title: 'Playback de Abertura',    meta: 'youtube.com/...', icon: '▶️' },
  { type: 'pdf',     title: 'Cronograma do Culto',     meta: '1 página',        icon: '📄' },
]

export default function MyAreaPage() {
  const { user } = useAppStore()
  const [checkedIn,     setCheckedIn]     = useState(false)
  const [showSwap,      setShowSwap]      = useState(false)
  const [showUnavail,   setShowUnavail]   = useState(false)
  const [showFeedback,  setShowFeedback]  = useState(false)
  const [unavailDays,   setUnavailDays]   = useState<number[]>([])
  const [tab, setTab] = useState('upcoming')

  const next = MOCK_MY_SCHEDULES[0]
  const tier = getPointsTier(user?.points ?? 980)

  const toggleDay = (i: number) => {
    setUnavailDays(prev => prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i])
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">

      {/* Profile hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-5">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-accent/15 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
            style={{ background: getAvatarColor(user?.name || 'Voluntário') }}>
            {getInitials(user?.name || 'V')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-base truncate">{user?.name || 'Voluntário'}</div>
            <div className="text-white/50 text-xs mt-0.5">{user?.role === 'leader' ? 'Líder' : 'Voluntário'} • Louvor</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge text-xs font-bold" style={{ background: `${tier.color}25`, color: tier.color }}>
                {tier.icon} {tier.label}
              </span>
              <span className="text-xs text-white/40">{user?.points ?? 980} pontos</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-extrabold text-white">{user?.presence_rate ?? 88}%</div>
            <div className="text-[10px] text-white/40 font-bold tracking-widest">PRESENÇA</div>
          </div>
        </div>
      </div>

      {/* Next schedule quick-action */}
      {next && (
        <div className="rounded-2xl bg-gradient-to-br from-secondary to-accent p-4 text-white">
          <div className="text-[10px] font-bold tracking-[1.5px] opacity-60 mb-1 uppercase">Próxima Escala</div>
          <div className="font-bold text-base mb-0.5">{next.event}</div>
          <div className="text-xs opacity-70 mb-3">
            {formatDayLabel(next.date)} • {new Date(next.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl p-2.5 mb-3 backdrop-blur-sm border border-white/10 text-sm">
            <span>🎵</span>
            <div>
              <div className="font-semibold text-xs">{next.ministry}</div>
              <div className="text-[11px] opacity-70">{next.role}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setCheckedIn(!checkedIn); toast.success(checkedIn ? 'Check-in cancelado.' : '📍 Check-in realizado!') }}
              className="py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97]"
              style={{ background: checkedIn ? 'rgba(255,255,255,0.15)' : '#FFFFFF', color: checkedIn ? '#FFFFFF' : '#2563EB' }}
            >
              {checkedIn ? '✅ Check-in OK' : '📍 Check-in'}
            </button>
            <button
              onClick={() => setShowSwap(true)}
              className="py-2.5 rounded-xl font-bold text-sm bg-white/15 text-white border border-white/20 transition-all active:scale-[0.97]"
            >
              🔄 Solicitar Troca
            </button>
          </div>
        </div>
      )}

      {/* Quick actions row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: '📅', label: 'Escalas',      action: () => setTab('upcoming') },
          { icon: '🔄', label: 'Troca',         action: () => setShowSwap(true) },
          { icon: '🚫', label: 'Indisponível',  action: () => setShowUnavail(true) },
          { icon: '🎵', label: 'Materiais',     action: () => setTab('materials') },
        ].map(a => (
          <button key={a.label} onClick={a.action}
            className="card p-3 flex flex-col items-center gap-1.5 hover:shadow-hover transition-all active:scale-[0.97]">
            <span className="text-2xl">{a.icon}</span>
            <span className="text-[10px] font-bold text-muted">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { key: 'upcoming', label: 'Escalas',   icon: '📅' },
          { key: 'materials',label: 'Materiais', icon: '🎵' },
          { key: 'feedback', label: 'Feedback',  icon: '💬' },
          { key: 'points',   label: 'Pontuação', icon: '⭐' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* Tab content */}
      {tab === 'upcoming' && (
        <div className="space-y-2">
          {MOCK_MY_SCHEDULES.map(s => (
            <div key={s.id} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}18` }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[#020617] truncate">{s.event}</div>
                  <div className="text-xs text-muted mt-0.5">
                    {formatDayLabel(s.date)} • {new Date(s.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="badge bg-[#F8FAFC] text-muted border border-[#E2E8F0] text-[10px]">{s.ministry}</span>
                    <span className="text-xs text-muted">{s.role}</span>
                  </div>
                </div>
                <Badge variant={s.status === 'confirmed' ? 'success' : 'warning'}>
                  {s.status === 'confirmed' ? '✓' : '⏳'}
                </Badge>
              </div>
              {s.status === 'pending' && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-[#F8FAFC]">
                  <Button variant="primary" size="sm" className="flex-1 justify-center"
                    onClick={() => toast.success('Presença confirmada! ✅')}>
                    <CheckCircle size={13} /> Confirmar
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1 justify-center"
                    onClick={() => setShowSwap(true)}>
                    <RefreshCw size={13} /> Troca
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'materials' && (
        <div className="space-y-2">
          <div className="p-3 bg-[#FFFBEB] border border-amber-200 rounded-xl text-xs text-amber-700 font-medium mb-1">
            📌 Materiais do Culto Dominical — 19 Jan
          </div>
          {MOCK_MATERIALS.map((m, i) => (
            <button key={i} className="card p-4 w-full text-left hover:shadow-hover transition-all active:scale-[0.99] flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                m.type === 'chord' ? 'bg-accent' : m.type === 'youtube' ? 'bg-danger' : 'bg-secondary'
              }`}>{m.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{m.title}</div>
                <div className="text-xs text-muted">{m.meta}</div>
              </div>
              <ChevronRight size={14} className="text-muted flex-shrink-0" />
            </button>
          ))}
        </div>
      )}

      {tab === 'feedback' && (
        <div className="space-y-3">
          {[
            { from: 'Pastor André',  rating: 5, comment: 'Excelente trabalho no louvor! Muito comprometida.', date: '19 Jan' },
            { from: 'Maria Oliveira',rating: 4, comment: 'Ótima liderança durante o culto.',                   date: '15 Jan' },
          ].map((f, i) => (
            <Card key={i}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">{f.from}</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={12} className={j < f.rating ? 'fill-amber-400 text-amber-400' : 'text-[#E2E8F0]'} />
                  ))}
                  <span className="text-xs text-muted ml-1">{f.date}</span>
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed">{f.comment}</p>
            </Card>
          ))}
          <Button variant="secondary" className="w-full justify-center gap-2"
            onClick={() => setShowFeedback(true)}>
            <Star size={14} /> Dar Feedback ao Líder
          </Button>
        </div>
      )}

      {tab === 'points' && (
        <div className="space-y-4">
          <Card>
            <div className="text-center py-2">
              <div className="text-4xl mb-2">{tier.icon}</div>
              <div className="text-3xl font-display font-extrabold text-[#020617]">{user?.points ?? 980}</div>
              <div className="text-sm text-muted mt-1">pontos acumulados</div>
              <div className="inline-block mt-2 badge" style={{ background: `${tier.color}18`, color: tier.color }}>
                Tier {tier.label}
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <ProgressBar value={((user?.points ?? 980) / 1600) * 100} color={tier.color} label="Progresso para Diamante" showValue />
            </div>
          </Card>
          <Card>
            <div className="text-sm font-bold mb-3">Histórico de Pontos</div>
            {[
              { event: 'Culto Dominical',   date: '19 Jan', pts: '+15', color: '#16A34A' },
              { event: 'Culto de Quarta',   date: '15 Jan', pts: '+10', color: '#16A34A' },
              { event: 'Culto Dominical',   date: '12 Jan', pts: '+15', color: '#16A34A' },
              { event: 'Ausência registrada',date:'05 Jan', pts: '0',   color: '#DC2626' },
            ].map((h, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#F8FAFC] last:border-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: h.color }} />
                <div className="flex-1 text-sm">{h.event}</div>
                <div className="text-xs text-muted">{h.date}</div>
                <div className="text-sm font-bold" style={{ color: h.color }}>{h.pts}</div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Swap Modal */}
      <Modal open={showSwap} onClose={() => setShowSwap(false)} title="🔄 Solicitar Troca de Escala" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Escala para trocar</label>
            <select className="input">
              {MOCK_MY_SCHEDULES.map(s => <option key={s.id}>{s.event} — {formatDayLabel(s.date)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Motivo</label>
            <textarea className="input h-20 resize-none" placeholder="Ex: Viagem, compromisso profissional..." />
          </div>
          <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            ⚠️ A troca precisa ser aceita por outro voluntário e aprovada pelo líder.
          </div>
          <div className="flex gap-2.5">
            <Button variant="secondary" className="flex-1 justify-center" onClick={() => setShowSwap(false)}>Cancelar</Button>
            <Button variant="primary" className="flex-1 justify-center"
              onClick={() => { setShowSwap(false); toast.success('Solicitação enviada! O líder será notificado.') }}>
              Enviar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Unavailability Modal */}
      <Modal open={showUnavail} onClose={() => setShowUnavail(false)} title="🚫 Informar Indisponibilidade" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted leading-relaxed">
            Marque os dias em que você não poderá ser escalado. Isso será respeitado na geração automática de escalas.
          </p>
          <div className="grid grid-cols-4 gap-2">
            {DAY_LABELS.map((d, i) => (
              <button key={d} onClick={() => toggleDay(i)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  unavailDays.includes(i)
                    ? 'bg-danger/10 border-danger text-danger'
                    : 'border-[#E2E8F0] text-muted hover:border-[#CBD5E1]'
                }`}>
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
          {unavailDays.length > 0 && (
            <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-xs text-danger">
              ⚠️ Indisponível: {unavailDays.map(d => DAY_LABELS[d]).join(', ')}
            </div>
          )}
          <div className="flex gap-2.5">
            <Button variant="secondary" className="flex-1 justify-center" onClick={() => setShowUnavail(false)}>Cancelar</Button>
            <Button variant="primary" className="flex-1 justify-center"
              onClick={() => { setShowUnavail(false); toast.success('Indisponibilidade salva! ✅') }}>
              Salvar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Feedback Modal */}
      <Modal open={showFeedback} onClose={() => setShowFeedback(false)} title="💬 Dar Feedback" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">Avaliação</label>
            <div className="flex gap-2 justify-center">
              {[1,2,3,4,5].map(n => (
                <button key={n} className="w-11 h-11 rounded-xl border border-[#E2E8F0] hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center justify-center">
                  <Star size={20} className="text-amber-400" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Comentário</label>
            <textarea className="input h-24 resize-none" placeholder="Compartilhe sua experiência..." />
          </div>
          <div className="flex gap-2.5">
            <Button variant="secondary" className="flex-1 justify-center" onClick={() => setShowFeedback(false)}>Cancelar</Button>
            <Button variant="primary" className="flex-1 justify-center"
              onClick={() => { setShowFeedback(false); toast.success('Feedback enviado! 💬') }}>
              Enviar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
