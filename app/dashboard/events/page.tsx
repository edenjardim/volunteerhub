'use client'

import { useState } from 'react'
import { Plus, Music, Youtube, FileText, Upload, ChevronRight, Palette, Link as LinkIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEvents } from '@/hooks'
import { formatDate, NOTES, transposeChordSheet } from '@/lib/utils'
import type { EventType } from '@/types'

const Modal = ({ open, onClose, title, children, size = 'md' }: any) => {
  if (!open) return null
  const w = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size] || 'max-w-lg'
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

const TYPE_STYLES: Record<EventType, { label: string; badge: string; color: string }> = {
  regular:    { label: 'Regular',     badge: 'bg-[#EFF6FF] text-secondary', color: '#2563EB' },
  special:    { label: 'Especial',    badge: 'bg-[#F5F3FF] text-accent',    color: '#7C3AED' },
  training:   { label: 'Treinamento', badge: 'bg-[#F0FDF4] text-success',   color: '#16A34A' },
  conference: { label: 'Conferência', badge: 'bg-[#FEF2F2] text-danger',    color: '#DC2626' },
}

const MOCK_EVENTS: any[] = [
  { id: '1', title: 'Culto Dominical',       event_date: '2025-01-19T09:00', type: 'regular',    color: '#2563EB', dress_colors: ['#1E3A5F','#FFFFFF','#2563EB'], dress_code: 'Formal Azul',  volunteer_count: 48, content: [] },
  { id: '2', title: 'Culto de Quarta',        event_date: '2025-01-22T19:30', type: 'regular',    color: '#7C3AED', dress_colors: ['#0F172A','#FFFFFF'],          dress_code: 'Social Escuro', volunteer_count: 22, content: [] },
  { id: '3', title: 'Conferência de Louvor', event_date: '2025-01-25T10:00', type: 'conference', color: '#DC2626', dress_colors: ['#DC2626','#FFFFFF','#F8FAFC'], dress_code: 'Casual Vermelho', volunteer_count: 65, content: [] },
  { id: '4', title: 'Treinamento de Líderes',event_date: '2025-01-28T19:00', type: 'training',   color: '#16A34A', dress_colors: ['#16A34A','#FFFFFF'],          dress_code: 'Casual Verde',  volunteer_count: 18, content: [] },
]

const CHORD_SAMPLE = `G        Em       C         D
Grandes e maravilhosas são tuas obras
G        Em       C         D
Senhor Deus todo poderoso`

export default function EventsPage() {
  const [showNew,      setShowNew]      = useState(false)
  const [showDetail,   setShowDetail]   = useState(false)
  const [showChord,    setShowChord]    = useState(false)
  const [selected,     setSelected]     = useState<any>(null)
  const [detailTab,    setDetailTab]    = useState<'content'|'schedule'|'dress'>('content')
  const [chordFrom,    setChordFrom]    = useState('G')
  const [chordTo,      setChordTo]      = useState('A')
  const [transposed,   setTransposed]   = useState('')
  const [newEventType, setNewEventType] = useState<EventType>('regular')

  const { data: events = [] } = useEvents()
  const list = events.length ? events : MOCK_EVENTS

  const openDetail = (e: any) => { setSelected(e); setDetailTab('content'); setShowDetail(true) }

  const handleTranspose = () => {
    const result = transposeChordSheet(CHORD_SAMPLE, chordFrom, chordTo)
    setTransposed(result)
    toast.success(`Cifra transposta de ${chordFrom} para ${chordTo}!`)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">Eventos</h1>
          <p className="text-sm text-muted mt-1">Cultos, conferências e treinamentos</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn btn-primary">
          <Plus size={16} /> Novo Evento
        </button>
      </div>

      {/* Month nav */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {['Janeiro 2025','Fevereiro 2025','Março 2025'].map((m, i) => (
          <button key={m} className={`btn whitespace-nowrap ${i === 0 ? 'btn-primary' : 'btn-secondary'}`}>{m}</button>
        ))}
      </div>

      {/* Event cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map(ev => {
          const typeStyle = TYPE_STYLES[ev.type as EventType] || TYPE_STYLES.regular
          return (
            <div key={ev.id} className="card cursor-pointer hover:shadow-hover hover:-translate-y-px transition-all"
              onClick={() => openDetail(ev)}>
              {/* Color bar */}
              <div className="h-1.5 rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${typeStyle.color}, ${typeStyle.color}55)` }} />

              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-[#020617] mb-1">{ev.title}</div>
                  <div className="text-xs text-muted">
                    📅 {formatDate(ev.event_date)} • ⏰ {new Date(ev.event_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className={`badge ${typeStyle.badge}`}>{typeStyle.label}</span>
              </div>

              {/* Dress code */}
              <div className="flex items-center gap-2 mb-3 px-3 py-2.5 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                <Palette size={13} className="text-muted flex-shrink-0" />
                <span className="text-xs font-medium text-muted flex-1">{ev.dress_code || 'Paleta não definida'}</span>
                <div className="flex gap-1">
                  {(ev.dress_colors || []).map((c: string, i: number) => (
                    <div key={i} className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ background: c }} />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-muted px-3 py-1.5 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9]">
                  👥 <span className="font-semibold">{ev.volunteer_count}</span> escalados
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted px-3 py-1.5 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9]">
                  🎵 <span className="font-semibold">{(ev.content || []).length}</span> arquivos
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#F1F5F9]" onClick={e => e.stopPropagation()}>
                <button onClick={() => openDetail(ev)} className="btn btn-secondary text-xs py-1.5 flex-1 justify-center">
                  📋 Detalhes
                </button>
                <button onClick={() => toast('Abrindo escala...')} className="btn btn-secondary text-xs py-1.5 flex-1 justify-center">
                  📅 Escala
                </button>
                <button onClick={() => { setSelected(ev); setShowChord(true) }}
                  className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center text-muted hover:text-secondary hover:border-secondary transition-colors">
                  <Music size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Event Detail Modal */}
      <Modal open={showDetail} onClose={() => setShowDetail(false)} title={selected?.title || ''} size="xl">
        {selected && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="col-span-2 p-4 bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] rounded-xl text-white">
                <div className="text-xs opacity-50 font-bold tracking-widest uppercase mb-1">{TYPE_STYLES[selected.type as EventType]?.label}</div>
                <div className="text-lg font-bold">{selected.title}</div>
                <div className="text-sm opacity-60 mt-1">
                  {formatDate(selected.event_date)} • {new Date(selected.event_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex gap-3 mt-4">
                  <div><div className="text-lg font-display font-extrabold">{selected.volunteer_count}</div><div className="text-[10px] opacity-40 tracking-widest">ESCALADOS</div></div>
                  <div><div className="text-lg font-display font-extrabold">{(selected.content || []).length}</div><div className="text-[10px] opacity-40 tracking-widest">ARQUIVOS</div></div>
                </div>
              </div>
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                <div className="text-xs font-bold text-muted uppercase tracking-wide mb-3">Paleta de Roupas</div>
                <div className="flex gap-2 mb-2">
                  {(selected.dress_colors || []).map((c: string, i: number) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ background: c }} />
                  ))}
                </div>
                <div className="text-sm font-semibold text-[#020617]">{selected.dress_code || '—'}</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] mb-4">
              {[['content','🎵 Conteúdo'],['schedule','📅 Escala'],['dress','👔 Figurino']].map(([k, label]) => (
                <button key={k} onClick={() => setDetailTab(k as any)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${detailTab === k ? 'bg-white shadow-sm text-[#020617]' : 'text-muted'}`}>
                  {label}
                </button>
              ))}
            </div>

            {detailTab === 'content' && (
              <div>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {[
                    { icon: Music,    label: 'Adicionar Cifra',  action: () => { setShowDetail(false); setShowChord(true) } },
                    { icon: Youtube,  label: 'Link YouTube',     action: () => toast('Adicionar link...') },
                    { icon: FileText, label: 'Upload PDF',       action: () => toast('Upload PDF...') },
                    { icon: Upload,   label: 'Upload Arquivo',   action: () => toast('Upload arquivo...') },
                  ].map(({ icon: Icon, label, action }) => (
                    <button key={label} onClick={action} className="btn btn-secondary text-xs gap-1.5 py-2">
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { type: 'chord',   title: 'Grandes e Maravilhosas',  meta: 'Tom: G' },
                    { type: 'chord',   title: 'Santo Espírito',          meta: 'Tom: C' },
                    { type: 'youtube', title: 'Playback - Abertura',     meta: 'youtube.com/...' },
                    { type: 'pdf',     title: 'Cronograma do Culto',     meta: '1 página' },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3.5 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] group hover:border-secondary transition-colors cursor-pointer">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                        c.type === 'chord' ? 'bg-accent' : c.type === 'youtube' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {c.type === 'chord' ? '♪' : c.type === 'youtube' ? '▶' : '📄'}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{c.title}</div>
                        <div className="text-xs text-muted">{c.meta}</div>
                      </div>
                      {c.type === 'chord' && (
                        <button onClick={() => { setShowDetail(false); setShowChord(true) }}
                          className="opacity-0 group-hover:opacity-100 btn btn-secondary text-xs py-1 px-2 transition-opacity">
                          Transpor
                        </button>
                      )}
                      <ChevronRight size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detailTab === 'schedule' && (
              <div className="space-y-2">
                {['Louvor e Adoração','Mídia e Tecnologia','Recepção','Intercessão'].map(m => (
                  <div key={m} className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                    <div className="text-sm font-semibold">{m}</div>
                    <div className="flex items-center gap-2">
                      <span className="badge bg-[#F0FDF4] text-success">3–4 escalados</span>
                      <button className="btn btn-secondary text-xs py-1 px-2">Ver</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {detailTab === 'dress' && (
              <div>
                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] mb-4">
                  <div className="text-sm font-bold mb-3">Paleta de Cores para Voluntários</div>
                  <div className="flex gap-3 mb-3">
                    {(selected.dress_colors || []).map((c: string, i: number) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-xl border-2 border-white shadow-md" style={{ background: c }} />
                        <div className="text-xs font-mono text-muted">{c}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-semibold text-[#020617]">Estilo: {selected.dress_code}</div>
                </div>
                <div className="space-y-2">
                  {['👔 Camisa social ou camiseta sólida','👖 Calça escura ou jeans escuro','👟 Sapato ou tênis limpo'].map(g => (
                    <div key={g} className="flex items-center gap-2.5 p-3 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9] text-sm">{g}</div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* Chord Transposer Modal */}
      <Modal open={showChord} onClose={() => setShowChord(false)} title="🎵 Transpor Cifra" size="lg">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1">Tom Atual</label>
                <select className="input w-20" value={chordFrom} onChange={e => setChordFrom(e.target.value)}>
                  {NOTES.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="mt-5 text-muted font-bold">→</div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1">Tom Destino</label>
                <select className="input w-20" value={chordTo} onChange={e => setChordTo(e.target.value)}>
                  {NOTES.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <button onClick={handleTranspose} className="btn btn-accent mt-5 gap-1.5">
                <Music size={14} /> Transpor
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-2">Cifra Original ({chordFrom})</label>
              <textarea className="input h-56 resize-none font-mono text-sm" defaultValue={CHORD_SAMPLE} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-muted uppercase tracking-wide">Resultado ({chordTo})</label>
              {transposed && <button onClick={() => { navigator.clipboard.writeText(transposed); toast.success('Copiado!') }} className="btn btn-secondary text-xs py-1 px-2">📋 Copiar</button>}
            </div>
            <textarea
              readOnly
              className="input h-56 resize-none font-mono text-sm bg-[#F8FAFC]"
              value={transposed || 'Clique em "Transpor" para ver o resultado...'}
            />
          </div>
        </div>
        <p className="text-xs text-muted mt-3 text-center">
          Transposição automática de acordes. Linhas de letra são mantidas intactas.
        </p>
      </Modal>

      {/* New Event Modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Novo Evento" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Nome do Evento *</label>
            <input className="input" placeholder="Ex: Culto Dominical, Conferência..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">Data *</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">Horário *</label>
              <input type="time" className="input" defaultValue="09:00" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(TYPE_STYLES).map(([k, v]) => (
                <button key={k} onClick={() => setNewEventType(k as EventType)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    newEventType === k ? `border-[${v.color}] bg-[${v.color}]/10 text-[${v.color}]` : 'border-[#E2E8F0] text-muted hover:border-[#CBD5E1]'
                  }`}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Paleta de Roupas</label>
            <input className="input" placeholder="Ex: Formal Azul, Casual Branco..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1.5">Descrição</label>
            <textarea className="input h-20 resize-none" placeholder="Detalhes sobre o evento..." />
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <button onClick={() => setShowNew(false)} className="btn btn-secondary">Cancelar</button>
            <button onClick={() => { setShowNew(false); toast.success('Evento criado! 📅') }} className="btn btn-primary">
              ✓ Criar Evento
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
