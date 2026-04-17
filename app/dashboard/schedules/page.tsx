'use client'

import { useState } from 'react'
import { Plus, Sparkles, RefreshCw, Calendar, List, Grid3X3, Download, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSchedules, useMinistries, useVolunteers } from '@/hooks'
import { useScheduleStore } from '@/store'
import { formatDate, scheduleStatusLabel, getInitials, getAvatarColor } from '@/lib/utils'
import type { AIScheduleSuggestion } from '@/types'

// ── Modal ───────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children, size = 'md' }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: string
}) => {
  if (!open) return null
  const w = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl' }[size] || 'max-w-lg'
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-2xl w-full ${w} max-h-[90vh] overflow-y-auto shadow-modal animate-slide-up`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <h3 className="text-base font-bold text-[#020617]">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-[#020617] transition-colors p-1">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ── Badge ───────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending:        'bg-[#FFFBEB] text-amber-700',
    confirmed:      'bg-[#F0FDF4] text-success',
    absent:         'bg-[#FEF2F2] text-danger',
    swap_requested: 'bg-[#F5F3FF] text-accent',
  }
  return <span className={`badge ${styles[status] || styles.pending}`}>{scheduleStatusLabel[status] || status}</span>
}

// ── Calendar View ───────────────────────────────────────────
const CalendarView = () => {
  const days = ['Dom 19', 'Seg 20', 'Ter 21', 'Qua 22', 'Qui 23', 'Sex 24', 'Sáb 25']
  const events = [
    { day: 0, time: '09:00', title: 'Culto Manhã',  color: '#2563EB' },
    { day: 0, time: '19:00', title: 'Culto Noite',  color: '#7C3AED' },
    { day: 3, time: '19:30', title: 'Culto Quarta', color: '#DC2626' },
    { day: 6, time: '20:00', title: 'Vigília',      color: '#16A34A' },
  ]
  return (
    <div className="grid grid-cols-7 gap-px bg-[#F1F5F9] rounded-xl overflow-hidden border border-[#E2E8F0]">
      {days.map((d, i) => (
        <div key={i} className="bg-white p-2 min-h-[120px]">
          <div className={`text-xs font-bold mb-2 ${i === 0 ? 'text-secondary' : 'text-muted'}`}>{d}</div>
          {events.filter(e => e.day === i).map((ev, j) => (
            <div key={j} className="rounded-md px-1.5 py-1 mb-1 text-white text-[10px] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: ev.color }}>
              {ev.time} {ev.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function SchedulesPage() {
  const { filters, setFilters } = useScheduleStore()
  const [showNew,  setShowNew]  = useState(false)
  const [showAI,   setShowAI]   = useState(false)
  const [aiStep,   setAIStep]   = useState<'config' | 'loading' | 'result'>('config')
  const [aiResult, setAIResult] = useState<AIScheduleSuggestion[]>([])

  const { data: schedules = [] } = useSchedules()
  const { data: ministries = [] } = useMinistries()
  const { data: volunteers = [] } = useVolunteers()

  const generateAI = () => {
    setAIStep('loading')
    setTimeout(() => {
      setAIResult([
        { volunteer: { name: 'Maria Oliveira', id: '1' } as any, ministry: { name: 'Louvor', color: '#7C3AED' } as any, role: 'Vocal Principal',  score: 98, reason: 'Alta presença, habilidade vocal confirmada, menor participação recente' },
        { volunteer: { name: 'João Santos',    id: '2' } as any, ministry: { name: 'Infantil', color: '#2563EB' } as any, role: 'Professor',       score: 94, reason: 'Líder do ministério, 94% presença, disponível' },
        { volunteer: { name: 'Lucas Ferreira', id: '3' } as any, ministry: { name: 'Mídia',    color: '#0891B2' } as any, role: 'Operador de Som', score: 91, reason: 'Especialista em áudio, sem conflito de escala' },
        { volunteer: { name: 'Ana Lima',       id: '4' } as any, ministry: { name: 'Recepção', color: '#16A34A' } as any, role: 'Recepcionista',   score: 89, reason: '92% presença, disponível, equilibra participação' },
        { volunteer: { name: 'Clara Mendes',   id: '5' } as any, ministry: { name: 'Intercessão', color: '#DC2626' } as any, role: 'Intercessora', score: 87, reason: 'Menor participação este mês, habilidade confirmada' },
      ])
      setAIStep('result')
    }, 2800)
  }

  const publishAI = () => {
    toast.success('✨ Escala gerada pela IA publicada para todos os voluntários!')
    setShowAI(false)
    setAIStep('config')
  }

  // Fallback mock data
  const displaySchedules = schedules.length ? schedules : [
    { id: '1', event: { title: 'Culto Dominical Manhã' }, event_date: '2025-01-19', time: '09:00', ministry: { name: 'Louvor e Adoração', color: '#7C3AED' }, role: 'Vocal Principal', status: 'confirmed', volunteer: { name: 'Maria Oliveira' } },
    { id: '2', event: { title: 'Culto Dominical Noite' }, event_date: '2025-01-19', time: '19:00', ministry: { name: 'Mídia e Tecnologia', color: '#0891B2' }, role: 'Operador de Som', status: 'pending',   volunteer: { name: 'Lucas Ferreira' } },
    { id: '3', event: { title: 'Culto de Quarta'       }, event_date: '2025-01-22', time: '19:30', ministry: { name: 'Intercessão',        color: '#DC2626' }, role: 'Intercessor',   status: 'confirmed', volunteer: { name: 'Clara Mendes'   } },
    { id: '4', event: { title: 'Culto Dominical Manhã' }, event_date: '2025-01-26', time: '09:00', ministry: { name: 'Recepção',           color: '#16A34A' }, role: 'Recepcionista', status: 'pending',   volunteer: { name: 'Ana Lima'        } },
  ] as any[]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">Escalas</h1>
          <p className="text-sm text-muted mt-1">Gerencie todas as escalas de voluntários</p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={() => setShowAI(true)} className="btn btn-secondary gap-2">
            <Sparkles size={15} className="text-accent" /> Gerar com IA
          </button>
          <button onClick={() => setShowNew(true)} className="btn btn-primary">
            <Plus size={16} /> Nova Escala
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* View toggle */}
        <div className="flex bg-white border border-[#E2E8F0] rounded-lg p-1 gap-1">
          {[
            { key: 'list',     icon: List,      label: 'Lista' },
            { key: 'calendar', icon: Calendar,  label: 'Calendário' },
            { key: 'ministry', icon: Grid3X3,   label: 'Ministério' },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setFilters({ view: key as any })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                filters.view === key
                  ? 'bg-secondary text-white shadow-sm'
                  : 'text-muted hover:text-[#020617] hover:bg-[#F8FAFC]'
              }`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-1">
          <select className="input flex-1" onChange={e => setFilters({ ministry_id: e.target.value })}>
            <option value="">Todos os Ministérios</option>
            {(ministries.length ? ministries : [
              { id: '1', name: 'Louvor e Adoração' },
              { id: '2', name: 'Infantil' },
              { id: '3', name: 'Mídia e Tecnologia' },
            ] as any[]).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select className="input w-40">
            <option>Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="absent">Ausente</option>
          </select>
          <button className="btn btn-ghost gap-1"><Download size={14} /> Exportar</button>
        </div>
      </div>

      {/* Content */}
      {filters.view === 'calendar' ? (
        <div className="card p-4">
          <CalendarView />
        </div>
      ) : filters.view === 'ministry' ? (
        <div className="space-y-4">
          {(ministries.length ? ministries : [
            { id: '1', name: 'Louvor e Adoração', icon: '🎵', color: '#7C3AED', leader: { name: 'Maria Oliveira' }, member_count: 18 },
            { id: '2', name: 'Infantil',           icon: '🧒', color: '#2563EB', leader: { name: 'João Santos'    }, member_count: 12 },
            { id: '3', name: 'Mídia',              icon: '📱', color: '#0891B2', leader: { name: 'Lucas Ferreira' }, member_count: 8  },
          ] as any[]).map(m => (
            <div key={m.id} className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${m.color}18` }}>{m.icon}</div>
                <div>
                  <div className="font-bold text-[#020617]">{m.name}</div>
                  <div className="text-xs text-muted">Líder: {m.leader?.name} • {m.member_count} membros</div>
                </div>
                <button className="btn btn-primary text-xs py-1.5 ml-auto">Ver Escalas</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['Dom 19 Jan', 'Dom 26 Jan', 'Dom 02 Fev'].map(d => (
                  <div key={d} className="text-xs px-3 py-1.5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg">
                    <span className="font-semibold" style={{ color: m.color }}>{d}</span>
                    <span className="text-muted ml-1.5">• 3 voluntários</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F1F5F9]">
                  {['Evento', 'Data/Hora', 'Ministério', 'Função', 'Voluntário', 'Status', 'Ações'].map(h => (
                    <th key={h} className="text-left text-[11px] font-bold text-muted uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displaySchedules.map(s => (
                  <tr key={s.id} className="border-b border-[#F8FAFC] hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.ministry?.color }} />
                        <span className="text-sm font-semibold text-[#020617]">{s.event?.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-sm text-[#64748B]">{formatDate(s.event_date)}</div>
                      <div className="text-xs text-muted">{s.time}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="badge bg-[#EFF6FF] text-secondary">{s.ministry?.name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#64748B]">{s.role}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ background: getAvatarColor(s.volunteer?.name || '') }}>
                          {getInitials(s.volunteer?.name || '?')}
                        </div>
                        <span className="text-sm">{s.volunteer?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => toast.success('Escala editada!')} className="btn btn-ghost text-xs py-1 px-2">✏️</button>
                        <button onClick={() => toast('Troca solicitada.')}      className="btn btn-ghost text-xs py-1 px-2">🔄</button>
                        <button onClick={() => toast.error('Escala excluída.')} className="btn btn-ghost text-xs py-1 px-2">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Schedule Modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Nova Escala">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Evento *</label>
            <select className="input">
              <option>Culto Dominical - 26 Jan</option>
              <option>Culto de Quarta - 29 Jan</option>
              <option>Conferência de Louvor - 25 Jan</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">Ministério *</label>
              <select className="input">
                {(ministries.length ? ministries : [
                  { id: '1', name: 'Louvor' }, { id: '2', name: 'Infantil' },
                ] as any[]).map(m => <option key={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">Função *</label>
              <input className="input" placeholder="Ex: Vocal, Baterista..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Voluntário *</label>
            <select className="input">
              {(volunteers.length ? volunteers : [
                { id: '1', name: 'Maria Oliveira' }, { id: '2', name: 'João Santos' },
              ] as any[]).map(v => <option key={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Observações</label>
            <textarea className="input h-20 resize-none" placeholder="Observações opcionais..." />
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <button onClick={() => setShowNew(false)} className="btn btn-secondary">Cancelar</button>
            <button onClick={() => { setShowNew(false); toast.success('Escala criada! 📅') }} className="btn btn-primary">
              ✓ Criar Escala
            </button>
          </div>
        </div>
      </Modal>

      {/* AI Modal */}
      <Modal open={showAI} onClose={() => { setShowAI(false); setAIStep('config') }} title="✨ Gerar Escala com Inteligência Artificial" size="lg">
        {aiStep === 'config' && (
          <div className="space-y-4">
            <p className="text-sm text-muted leading-relaxed">
              A IA analisa disponibilidade, histórico de participação, habilidades e equilíbrio para sugerir a melhor escala automaticamente, evitando conflitos e respeitando todas as regras de negócio.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1.5">Evento</label>
                <select className="input"><option>Culto Dominical - 26 Jan</option><option>Culto de Quarta - 29 Jan</option></select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1.5">Ministérios</label>
                <select className="input"><option>Todos os ministérios</option></select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
              {[
                ['Equilibrar participação', true],
                ['Respeitar indisponibilidade', true],
                ['Priorizar habilidades', true],
                ['Evitar conflitos de dia', true],
                ['Considerar pontuação', false],
                ['Notificar automaticamente', false],
              ].map(([label, checked], i) => (
                <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" defaultChecked={checked as boolean} className="w-4 h-4 accent-secondary rounded" />
                  {label}
                </label>
              ))}
            </div>
            <button onClick={generateAI} className="btn btn-accent w-full justify-center py-3 text-base">
              <Sparkles size={18} /> Gerar Escala Inteligente
            </button>
          </div>
        )}

        {aiStep === 'loading' && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4">
              <Sparkles size={28} className="text-accent animate-pulse" />
            </div>
            <div className="text-base font-bold text-[#020617] mb-2">Analisando dados...</div>
            <p className="text-sm text-muted mb-6">Verificando 87 voluntários, disponibilidades e regras de negócio</p>
            <div className="w-48 h-1.5 bg-[#F1F5F9] rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-secondary to-accent rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" style={{ width: '70%' }} />
            </div>
          </div>
        )}

        {aiStep === 'result' && (
          <div>
            <div className="flex items-center gap-2 p-3.5 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] mb-4">
              <span className="text-success text-lg">✓</span>
              <div>
                <div className="text-sm font-bold text-success">Escala gerada com sucesso!</div>
                <div className="text-xs text-green-600">Conflitos detectados: 0 • Equilíbrio: Excelente • 5 voluntários alocados</div>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-[#E2E8F0]">
              <table className="w-full">
                <thead className="bg-[#F8FAFC]">
                  <tr>{['Voluntário', 'Ministério', 'Função', 'Score IA', 'Motivo'].map(h => (
                    <th key={h} className="text-left text-[11px] font-bold text-muted uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {aiResult.map((r, i) => (
                    <tr key={i} className="border-t border-[#F1F5F9]">
                      <td className="px-4 py-3 text-sm font-semibold">{r.volunteer.name}</td>
                      <td className="px-4 py-3">
                        <span className="badge" style={{ background: `${r.ministry.color}18`, color: r.ministry.color }}>{r.ministry.name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">{r.role}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-success">{r.score}%</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted max-w-[200px] truncate" title={r.reason}>{r.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2.5 mt-4">
              <button onClick={() => setAIStep('config')} className="btn btn-secondary gap-1.5"><RefreshCw size={14} /> Regenerar</button>
              <button onClick={publishAI} className="btn btn-primary gap-1.5"><Sparkles size={14} /> Publicar Escala</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
