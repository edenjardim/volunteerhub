'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Users, ChevronRight, Music } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMinistries, useVolunteers } from '@/hooks'
import { getInitials, getAvatarColor } from '@/lib/utils'

const Modal = ({ open, onClose, title, children, size = 'md' }: any) => {
  if (!open) return null
  const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl'
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
  <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
  </div>
)

const MOCK_MINISTRIES: any[] = [
  { id: '1', name: 'Louvor e Adoração',  icon: '🎵', color: '#7C3AED', leader: { name: 'Maria Oliveira' }, member_count: 18, presence_rate: 96, functions: ['Vocal','Violão','Baixo','Bateria','Teclado','Percussão'] },
  { id: '2', name: 'Infantil',           icon: '🧒', color: '#2563EB', leader: { name: 'João Santos'    }, member_count: 12, presence_rate: 91, functions: ['Professor','Monitor','Pregador Infantil'] },
  { id: '3', name: 'Mídia e Tecnologia', icon: '📱', color: '#0891B2', leader: { name: 'Lucas Ferreira' }, member_count: 8,  presence_rate: 94, functions: ['Operador de Som','Camera','Transmissão','Slides'] },
  { id: '4', name: 'Recepção',           icon: '🤝', color: '#16A34A', leader: { name: 'Ana Lima'       }, member_count: 15, presence_rate: 89, functions: ['Recepcionista','Estacionamento','Café'] },
  { id: '5', name: 'Intercessão',        icon: '🙏', color: '#DC2626', leader: { name: 'Clara Mendes'   }, member_count: 10, presence_rate: 87, functions: ['Intercessor','Líder de Oração'] },
  { id: '6', name: 'Dízimos e Ofertas',  icon: '💛', color: '#F59E0B', leader: { name: 'Roberto Costa'  }, member_count: 6,  presence_rate: 93, functions: ['Coleta','Contagem','Tesouraria'] },
]

const MOCK_MEMBERS: Record<string, any[]> = {
  '1': [
    { id: '1', name: 'Maria Oliveira', role: 'Vocal Principal',   priority: 1 },
    { id: '2', name: 'Patricia Souza', role: 'Teclado',           priority: 1 },
    { id: '3', name: 'Carlos Dias',    role: 'Bateria',           priority: 2 },
    { id: '4', name: 'Luisa Faria',    role: 'Violão',            priority: 1 },
  ],
}

export default function MinistriesPage() {
  const [showModal,   setShowModal]   = useState(false)
  const [showDetail,  setShowDetail]  = useState(false)
  const [selected,    setSelected]    = useState<any>(null)
  const [detailTab,   setDetailTab]   = useState<'members'|'schedules'|'settings'>('members')

  const { data: ministries = [] } = useMinistries()
  const { data: volunteers = [] } = useVolunteers()
 const list = Array.isArray(ministries) && ministries.length ? ministries : MOCK_MINISTRIES

  const openDetail = (m: any) => { setSelected(m); setDetailTab('members'); setShowDetail(true) }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">Ministérios</h1>
          <p className="text-sm text-muted mt-1">Organize e gerencie cada ministério da sua igreja</p>
        </div>
        <button onClick={() => { setSelected(null); setShowModal(true) }} className="btn btn-primary">
          <Plus size={16} /> Novo Ministério
        </button>
      </div>

      {/* Overview row */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {list.map(m => (
          <div key={m.id} onClick={() => openDetail(m)}
            className="card p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 hover:shadow-hover transition-all text-center">
            <div className="text-2xl">{m.icon}</div>
            <div className="text-xs font-bold text-[#020617] leading-tight">{m.name.split(' ')[0]}</div>
            <div className="text-[10px] font-semibold" style={{ color: m.color }}>{m.member_count} membros</div>
          </div>
        ))}
      </div>

      {/* Ministry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map(m => (
          <div key={m.id} className="card cursor-pointer hover:shadow-hover hover:-translate-y-px transition-all" onClick={() => openDetail(m)}>
            {/* Color bar */}
            <div className="h-1 rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${m.color}, ${m.color}55)` }} />

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${m.color}15` }}>
                  {m.icon}
                </div>
                <div>
                  <div className="font-bold text-[#020617] text-sm leading-tight">{m.name}</div>
                  <div className="text-xs text-muted mt-0.5">Líder: {m.leader?.name}</div>
                </div>
              </div>
              <span className="badge bg-[#F8FAFC] text-muted border border-[#E2E8F0]">
                <Users size={10} className="mr-1" />{m.member_count}
              </span>
            </div>

            {/* Functions */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(m.functions || []).slice(0, 4).map((f: string) => (
                <span key={f} className="text-[10px] px-2 py-0.5 rounded-md font-semibold" style={{ background: `${m.color}12`, color: m.color }}>{f}</span>
              ))}
              {(m.functions || []).length > 4 && (
                <span className="text-[10px] px-2 py-0.5 rounded-md text-muted bg-[#F1F5F9]">+{(m.functions || []).length - 4}</span>
              )}
            </div>

            {/* Presence */}
            <div className="bg-[#F8FAFC] rounded-xl p-3 mb-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted font-medium">Taxa de presença</span>
                <span className="font-bold" style={{ color: m.color }}>{m.presence_rate}%</span>
              </div>
              <Bar value={m.presence_rate} color={m.color} />
            </div>

            <div className="flex gap-2 pt-3 border-t border-[#F1F5F9]" onClick={e => e.stopPropagation()}>
              <button onClick={() => openDetail(m)} className="btn btn-secondary text-xs py-1.5 flex-1 justify-center">
                <Users size={12} /> Membros
              </button>
              <button onClick={() => toast('Abrindo escalas...')} className="btn btn-secondary text-xs py-1.5 flex-1 justify-center">
                📅 Escalas
              </button>
              <button onClick={() => { setSelected(m); setShowModal(true) }}
                className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center text-muted hover:text-secondary hover:border-secondary transition-colors">
                <Edit size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ministry Detail Modal */}
      <Modal open={showDetail} onClose={() => setShowDetail(false)} title={selected ? `${selected.icon} ${selected.name}` : ''} size="lg">
        {selected && (
          <>
            {/* Header stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Membros', value: selected.member_count },
                { label: 'Presença', value: `${selected.presence_rate}%` },
                { label: 'Próximo', value: 'Dom 26 Jan' },
              ].map(s => (
                <div key={s.label} className="text-center p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                  <div className="text-lg font-display font-extrabold" style={{ color: selected.color }}>{s.value}</div>
                  <div className="text-xs text-muted font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] mb-4">
              {[['members','👥 Membros'],['schedules','📅 Escalas'],['settings','⚙️ Config']].map(([k, label]) => (
                <button key={k} onClick={() => setDetailTab(k as any)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${detailTab === k ? 'bg-white shadow-sm text-[#020617]' : 'text-muted'}`}>
                  {label}
                </button>
              ))}
            </div>

            {detailTab === 'members' && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold">Membros do Ministério</span>
                  <button className="btn btn-primary text-xs py-1.5 px-3 gap-1"><Plus size={12} /> Adicionar</button>
                </div>
                <div className="space-y-2">
                  {(MOCK_MEMBERS[selected.id] || [
                    { id: 'a', name: 'Membro 1', role: 'Função 1', priority: 1 },
                    { id: 'b', name: 'Membro 2', role: 'Função 2', priority: 2 },
                  ]).map((m: any) => (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: getAvatarColor(m.name) }}>
                        {getInitials(m.name)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{m.name}</div>
                        <div className="text-xs text-muted">{m.role}</div>
                      </div>
                      <span className={`badge ${m.priority === 1 ? 'bg-[#EFF6FF] text-secondary' : 'bg-[#F8FAFC] text-muted'}`}>
                        P{m.priority}
                      </span>
                      <button className="text-muted hover:text-danger transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detailTab === 'schedules' && (
              <div className="space-y-2">
                {['Dom 19 Jan', 'Dom 26 Jan', 'Dom 02 Fev'].map(d => (
                  <div key={d} className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                    <div>
                      <div className="text-sm font-semibold">Culto Dominical</div>
                      <div className="text-xs text-muted">{d} • 09:00 e 19:00</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge bg-[#F0FDF4] text-success">{selected.member_count > 10 ? 4 : 3} escalados</span>
                      <ChevronRight size={14} className="text-muted" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {detailTab === 'settings' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Nome</label>
                  <input className="input" defaultValue={selected.name} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Ícone</label>
                    <input className="input" defaultValue={selected.icon} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Cor</label>
                    <input type="color" className="input h-10 p-1" defaultValue={selected.color} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Líder Responsável</label>
                  <select className="input"><option>{selected.leader?.name}</option></select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Funções</label>
                  <input className="input" defaultValue={selected.functions?.join(', ')} />
                </div>
                <button onClick={() => { setShowDetail(false); toast.success('Ministério atualizado!') }} className="btn btn-primary w-full justify-center">
                  Salvar Configurações
                </button>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* New/Edit Ministry Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={selected ? 'Editar Ministério' : 'Novo Ministério'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Nome do Ministério *</label>
            <input className="input" defaultValue={selected?.name} placeholder="Ex: Louvor e Adoração" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">Ícone (emoji)</label>
              <input className="input text-xl text-center" defaultValue={selected?.icon || '🎵'} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">Cor</label>
              <input type="color" className="input h-10 p-1" defaultValue={selected?.color || '#2563EB'} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Líder Responsável</label>
            <select className="input">
              {['Maria Oliveira','João Santos','Ana Lima','Lucas Ferreira','Clara Mendes'].map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Funções (separadas por vírgula)</label>
            <input className="input" defaultValue={selected?.functions?.join(', ')} placeholder="Vocal, Violão, Baixo, Bateria..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Descrição</label>
            <textarea className="input h-20 resize-none" placeholder="Breve descrição do ministério..." />
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancelar</button>
            <button onClick={() => { setShowModal(false); toast.success(selected ? 'Ministério atualizado!' : 'Ministério criado! 🎉') }} className="btn btn-primary">
              ✓ {selected ? 'Salvar' : 'Criar Ministério'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
