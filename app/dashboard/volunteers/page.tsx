'use client'

import { useState } from 'react'
import { Plus, Search, Star, MessageSquare, Edit, Trash2, Filter, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { useVolunteers, useMinistries, useDebounce } from '@/hooks'
import { getInitials, getAvatarColor, getPresenceColor, getPointsTier, roleLabel, DAY_LABELS, formatDate } from '@/lib/utils'
import type { User } from '@/types'

const Modal = ({ open, onClose, title, children, size = 'md' }: any) => {
  if (!open) return null
  const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl'
} as const

const w = sizes[size as keyof typeof sizes] || 'max-w-lg'
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-2xl w-full ${w} max-h-[90vh] overflow-y-auto shadow-modal animate-slide-up`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <h3 className="text-base font-bold">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-[#020617] p-1">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

const Bar = ({ value, color }: { value: number; color: string }) => (
  <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden flex-1">
    <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
  </div>
)

const MOCK: any[] = [
  { id: '1', name: 'Maria Oliveira', ministry: 'Louvor',     role: 'Vocal',      points: 1580, presence_rate: 98, is_active: true,  rank: 1, avatar_url: null, skills: ['Canto','Violão'], whatsapp: '11999990001', email: 'maria@igreja.com', profession: 'Professora' },
  { id: '2', name: 'João Santos',    ministry: 'Infantil',   role: 'Professor',  points: 1420, presence_rate: 94, is_active: true,  rank: 2, avatar_url: null, skills: ['Docência','Música'], whatsapp: '11999990002', email: 'joao@igreja.com', profession: 'Pedagogo' },
  { id: '3', name: 'Ana Lima',       ministry: 'Recepção',   role: 'Líder',      points: 1380, presence_rate: 92, is_active: true,  rank: 3, avatar_url: null, skills: ['Liderança','Comunicação'], whatsapp: '11999990003', email: 'ana@igreja.com', profession: 'Administradora' },
  { id: '4', name: 'Lucas Ferreira', ministry: 'Mídia',      role: 'Operador',   points: 1240, presence_rate: 96, is_active: true,  rank: 4, avatar_url: null, skills: ['Áudio','Vídeo','Streaming'], whatsapp: '11999990004', email: 'lucas@igreja.com', profession: 'TI' },
  { id: '5', name: 'Clara Mendes',   ministry: 'Intercessão',role: 'Intercessora',points: 1190, presence_rate: 89, is_active: true,  rank: 5, avatar_url: null, skills: ['Oração'], whatsapp: '11999990005', email: 'clara@igreja.com', profession: 'Enfermeira' },
  { id: '6', name: 'Roberto Costa',  ministry: 'Dízimos',    role: 'Voluntário', points: 980,  presence_rate: 85, is_active: true,  rank: 6, avatar_url: null, skills: ['Finanças','Organização'], whatsapp: '11999990006', email: 'roberto@igreja.com', profession: 'Contador' },
  { id: '7', name: 'Patricia Souza', ministry: 'Louvor',     role: 'Teclado',    points: 920,  presence_rate: 88, is_active: false, rank: 7, avatar_url: null, skills: ['Teclado','Piano'], whatsapp: '11999990007', email: 'patricia@igreja.com', profession: 'Musicista' },
  { id: '8', name: 'Diego Martins',  ministry: 'Mídia',      role: 'Camera',     points: 870,  presence_rate: 82, is_active: true,  rank: 8, avatar_url: null, skills: ['Câmera','Edição'], whatsapp: '11999990008', email: 'diego@igreja.com', profession: 'Fotógrafo' },
]

const COLORS = ['#7C3AED','#2563EB','#0891B2','#16A34A','#F59E0B','#DC2626','#DB2777','#0D9488']

export default function VolunteersPage() {
  const [search, setSearch]           = useState('')
  const [filterMin, setFilterMin]     = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showModal, setShowModal]     = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selected, setSelected]       = useState<any>(null)
  const [tab, setTab]                 = useState<'profile'|'schedules'|'feedback'>('profile')

  const debouncedSearch = useDebounce(search, 300)
  const { data: volunteers = [] } = useVolunteers()
  const { data: ministries = [] } = useMinistries()

 const list = (Array.isArray(volunteers) && volunteers.length ? volunteers : MOCK).filter(v => {
    const matchSearch = v.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchMin    = !filterMin    || v.ministry === filterMin
    const matchStatus = !filterStatus || (filterStatus === 'active' ? v.is_active : !v.is_active)
    return matchSearch && matchMin && matchStatus
  })

  const openProfile = (v: any) => { setSelected(v); setTab('profile'); setShowModal(true) }

  const handleSave = () => {
    setShowModal(false)
    toast.success(selected ? 'Voluntário atualizado! ✅' : 'Voluntário cadastrado! 🎉')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">Voluntários</h1>
          <p className="text-sm text-muted mt-1">Gerencie sua equipe de {MOCK.length} voluntários</p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={() => { toast('Exportando Excel...') }} className="btn btn-secondary gap-1.5">
            <Download size={15} /> Exportar
          </button>
          <button onClick={() => { setSelected(null); setShowModal(true) }} className="btn btn-primary">
            <Plus size={16} /> Novo Voluntário
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {[
          { value: '87', label: 'Total',    color: '#2563EB', bg: '#EFF6FF' },
          { value: '64', label: 'Ativos',   color: '#16A34A', bg: '#F0FDF4' },
          { value: '18', label: 'Líderes',  color: '#F59E0B', bg: '#FFFBEB' },
          { value: '5',  label: 'Inativos', color: '#DC2626', bg: '#FEF2F2' },
        ].map(s => (
          <div key={s.label} className="card">
            <div className="text-3xl font-display font-extrabold tracking-tight" style={{ color: s.color }}>{s.value}</div>
            <div className="text-sm text-muted font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="input pl-9"
              placeholder="Buscar voluntário por nome..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input w-full sm:w-52" value={filterMin} onChange={e => setFilterMin(e.target.value)}>
            <option value="">Todos os Ministérios</option>
            {['Louvor','Infantil','Mídia','Recepção','Intercessão','Dízimos'].map(m => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select className="input w-full sm:w-36" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Todos os Status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F1F5F9] bg-[#FAFAFA]">
                {['#','Voluntário','Ministério','Função','Presença','Pontos','Status','Ações'].map(h => (
                  <th key={h} className="text-left text-[11px] font-bold text-muted uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((v, i) => {
                const color = COLORS[i % COLORS.length]
                const tier  = getPointsTier(v.points)
                return (
                  <tr key={v.id} className="border-b border-[#F8FAFC] hover:bg-[#FAFAFA] transition-colors cursor-pointer" onClick={() => openProfile(v)}>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-bold ${i < 3 ? ['text-amber-500','text-slate-400','text-orange-400'][i] : 'text-[#CBD5E1]'}`}>
                        {i < 3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: color }}>
                          {getInitials(v.name)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#020617]">{v.name}</div>
                          <div className="text-xs text-muted">{v.email || v.profession}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="badge bg-[#EFF6FF] text-secondary">{v.ministry || (Array.isArray(v.ministries) ? v.ministries[0]?.ministry?.name : '')}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-muted">{v.role}</td>
                    <td className="px-4 py-3.5 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <Bar value={v.presence_rate ?? 90} color={getPresenceColor(v.presence_rate ?? 90)} />
                        <span className="text-xs font-bold w-10 text-right" style={{ color: getPresenceColor(v.presence_rate ?? 90) }}>
                          {v.presence_rate ?? 90}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <span className="text-base">{tier.icon}</span>
                        <span className="text-sm font-bold text-[#020617]">{v.points.toLocaleString('pt-BR')}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`badge ${v.is_active ? 'bg-[#F0FDF4] text-success' : 'bg-[#F8FAFC] text-muted'}`}>
                        {v.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button title="Feedback" onClick={() => { setSelected(v); setShowFeedback(true) }}
                          className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-muted hover:text-secondary hover:border-secondary transition-colors">
                          <MessageSquare size={13} />
                        </button>
                        <button title="Editar" onClick={() => openProfile(v)}
                          className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-muted hover:text-secondary hover:border-secondary transition-colors">
                          <Edit size={13} />
                        </button>
                        <button title="Excluir" onClick={() => toast.error('Voluntário removido.')}
                          className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-muted hover:text-danger hover:border-danger transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#F1F5F9] bg-[#FAFAFA]">
          <span className="text-xs text-muted">Mostrando {list.length} de 87 voluntários</span>
          <div className="flex gap-1">
            {[1,2,3,'...',9].map((p,i) => (
              <button key={i} className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors ${p === 1 ? 'bg-secondary text-white' : 'text-muted hover:bg-[#F1F5F9]'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Profile / Edit Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={selected ? `Perfil: ${selected.name}` : 'Novo Voluntário'} size="lg">
        {selected && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] p-5 mb-5">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent/20 -translate-y-1/2 translate-x-1/4 blur-xl" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                style={{ background: getAvatarColor(selected.name) }}>
                {getInitials(selected.name)}
              </div>
              <div className="text-white flex-1">
                <div className="text-lg font-bold">{selected.name}</div>
                <div className="text-sm opacity-60">{selected.role} • {selected.ministry}</div>
                <div className="flex gap-4 mt-3">
                  {[
                    { label: 'PRESENÇA', value: `${selected.presence_rate}%` },
                    { label: 'PONTOS',   value: selected.points.toLocaleString('pt-BR') },
                    { label: 'RANKING',  value: `#${selected.rank}` },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="text-base font-display font-extrabold">{s.value}</div>
                      <div className="text-[10px] opacity-40 tracking-widest font-bold">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        {selected && (
          <div className="flex gap-1 p-1 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] mb-5">
            {[['profile','👤 Perfil'],['schedules','📅 Escalas'],['feedback','💬 Feedbacks']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key as any)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${tab === key ? 'bg-white shadow-sm text-[#020617]' : 'text-muted hover:text-[#020617]'}`}>
                {label}
              </button>
            ))}
          </div>
        )}

        {tab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1.5">Nome Completo *</label>
                <input className="input" defaultValue={selected?.name} placeholder="Nome do voluntário" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1.5">E-mail *</label>
                <input type="email" className="input" defaultValue={selected?.email} placeholder="email@exemplo.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1.5">WhatsApp</label>
                <input className="input" defaultValue={selected?.whatsapp} placeholder="(11) 99999-0000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1.5">Profissão</label>
                <input className="input" defaultValue={selected?.profession} placeholder="Ex: Músico, Designer..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1.5">Ministério Principal</label>
                <select className="input" defaultValue={selected?.ministry}>
                  {['Louvor e Adoração','Infantil','Mídia e Tecnologia','Recepção','Intercessão','Dízimos e Ofertas'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1.5">Função</label>
                <input className="input" defaultValue={selected?.role} placeholder="Ex: Vocal, Baterista..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">Habilidades</label>
              <input className="input" defaultValue={selected?.skills?.join(', ')} placeholder="Ex: Canto, Violão, Teclado, Pregação..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2">Indisponibilidade (dias da semana)</label>
              <div className="flex gap-2 flex-wrap">
                {DAY_LABELS.map((d, i) => (
                  <button key={d} className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    selected?.unavailable_days?.includes(i)
                      ? 'bg-danger/10 border-danger text-danger'
                      : 'border-[#E2E8F0] text-muted hover:border-secondary hover:text-secondary'
                  }`}>{d.slice(0,3)}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">Perfil / Função</label>
              <select className="input" defaultValue={selected?.role_type || 'volunteer'}>
                {Object.entries(roleLabel).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        )}

        {tab === 'schedules' && (
          <div className="space-y-2">
            {[
              { event: 'Culto Dominical', date: '19 Jan', role: 'Vocal Principal', status: 'confirmed', color: '#7C3AED' },
              { event: 'Culto de Quarta', date: '22 Jan', role: 'Vocal de Apoio',  status: 'confirmed', color: '#7C3AED' },
              { event: 'Culto Dominical', date: '12 Jan', role: 'Vocal Principal', status: 'confirmed', color: '#7C3AED' },
              { event: 'Culto Dominical', date: '05 Jan', role: 'Vocal Principal', status: 'absent',    color: '#7C3AED' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{s.event}</div>
                  <div className="text-xs text-muted">{s.date} • {s.role}</div>
                </div>
                <span className={`badge ${s.status === 'confirmed' ? 'bg-[#F0FDF4] text-success' : 'bg-[#FEF2F2] text-danger'}`}>
                  {s.status === 'confirmed' ? '✓ Presente' : '✗ Ausente'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'feedback' && (
          <div className="space-y-3">
            {[
              { from: 'Pastor André', rating: 5, comment: 'Excelente trabalho no louvor! Muito comprometida e pontual.', date: '19 Jan' },
              { from: 'Maria Oliveira', rating: 4, comment: 'Ótima liderança durante o culto da quarta-feira.', date: '15 Jan' },
            ].map((f, i) => (
              <div key={i} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
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
              </div>
            ))}
            <button className="btn btn-secondary w-full justify-center gap-1.5" onClick={() => toast.success('Abrindo formulário de feedback...')}>
              <Plus size={14} /> Adicionar Feedback
            </button>
          </div>
        )}

        <div className="flex justify-end gap-2.5 pt-5 mt-5 border-t border-[#F1F5F9]">
          <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancelar</button>
          <button onClick={handleSave} className="btn btn-primary">
            ✓ {selected ? 'Salvar Alterações' : 'Cadastrar Voluntário'}
          </button>
        </div>
      </Modal>

      {/* Feedback Modal */}
      <Modal open={showFeedback} onClose={() => setShowFeedback(false)} title={`Feedback para ${selected?.name}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">Avaliação</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} className="w-10 h-10 rounded-xl border border-[#E2E8F0] hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center justify-center">
                  <Star size={18} className="text-amber-400" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Evento</label>
            <select className="input"><option>Culto Dominical - 19 Jan</option><option>Culto de Quarta - 22 Jan</option></select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Comentário</label>
            <textarea className="input h-24 resize-none" placeholder="Escreva seu feedback..." />
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => setShowFeedback(false)} className="btn btn-secondary flex-1 justify-center">Cancelar</button>
            <button onClick={() => { setShowFeedback(false); toast.success('Feedback enviado! 💬') }} className="btn btn-primary flex-1 justify-center">Enviar</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
