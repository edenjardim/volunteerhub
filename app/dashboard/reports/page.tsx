'use client'

import { useState } from 'react'
import { Download, Trophy, Star, TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getInitials, getAvatarColor, getPresenceColor, getPointsTier, downloadBlob } from '@/lib/utils'

const Bar = ({ value, color, label }: { value: number; color: string; label?: string }) => (
  <div>
    {label && <div className="text-xs text-muted mb-1">{label}</div>}
    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  </div>
)

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const PRESENCE_DATA = [78,82,88,85,91,87,93,89,94,91,96,88]

const MINISTRIES_DATA = [
  { name: 'Louvor e Adoração',  color: '#7C3AED', presence: 96, members: 18, events: 12 },
  { name: 'Infantil',           color: '#2563EB', presence: 91, members: 12, events: 12 },
  { name: 'Mídia e Tecnologia', color: '#0891B2', presence: 94, members: 8,  events: 12 },
  { name: 'Recepção',           color: '#16A34A', presence: 89, members: 15, events: 12 },
  { name: 'Intercessão',        color: '#DC2626', presence: 87, members: 10, events: 8  },
  { name: 'Dízimos e Ofertas',  color: '#F59E0B', presence: 93, members: 6,  events: 12 },
]

const RANKING = [
  { name: 'Maria Oliveira', ministry: 'Louvor',     presence: 98, points: 1580, attended: 12, absent: 0 },
  { name: 'João Santos',    ministry: 'Infantil',   presence: 94, points: 1420, attended: 11, absent: 1 },
  { name: 'Ana Lima',       ministry: 'Recepção',   presence: 92, points: 1380, attended: 11, absent: 1 },
  { name: 'Lucas Ferreira', ministry: 'Mídia',      presence: 96, points: 1240, attended: 12, absent: 0 },
  { name: 'Clara Mendes',   ministry: 'Intercessão',presence: 89, points: 1190, attended: 7,  absent: 1 },
  { name: 'Roberto Costa',  ministry: 'Dízimos',    presence: 85, points: 980,  attended: 10, absent: 2 },
  { name: 'Patricia Souza', ministry: 'Louvor',     presence: 88, points: 920,  attended: 7,  absent: 1 },
  { name: 'Diego Martins',  ministry: 'Mídia',      presence: 82, points: 870,  attended: 10, absent: 2 },
]

export default function ReportsPage() {
  const [period, setPeriod] = useState('Jan 2025')
  const [activeTab, setActiveTab] = useState<'overview'|'ranking'|'ministry'>('overview')

  const handleExport = (type: 'pdf' | 'excel') => {
    toast.success(`📊 Exportando relatório em ${type.toUpperCase()}...`)
  }

  const maxPresence = Math.max(...PRESENCE_DATA)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">Relatórios</h1>
          <p className="text-sm text-muted mt-1">Análise de desempenho e engajamento</p>
        </div>
        <div className="flex gap-2.5">
          <select className="input w-40" value={period} onChange={e => setPeriod(e.target.value)}>
            {['Jan 2025','Dez 2024','Nov 2024','Out 2024'].map(m => <option key={m}>{m}</option>)}
          </select>
          <button onClick={() => handleExport('pdf')}   className="btn btn-secondary gap-1.5"><Download size={14} /> PDF</button>
          <button onClick={() => handleExport('excel')} className="btn btn-primary gap-1.5"><Download size={14} color="#fff" /> Excel</button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {[
          { value: '91%',   label: 'Presença Média',       icon: BarChart3,  change: '+3%', up: true,  color: '#16A34A', bg: '#F0FDF4' },
          { value: '1.240', label: 'Pontos Distribuídos',  icon: Star,       change: '+180', up: true, color: '#F59E0B', bg: '#FFFBEB' },
          { value: '87',    label: 'Voluntários Ativos',   icon: Users,      change: '+4',  up: true,  color: '#2563EB', bg: '#EFF6FF' },
          { value: '12',    label: 'Eventos no Mês',       icon: Calendar,   color: '#7C3AED', bg: '#F5F3FF' },
        ].map(s => (
          <div key={s.label} className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-display font-extrabold tracking-tight text-[#020617]">{s.value}</div>
                <div className="text-sm text-muted mt-1">{s.label}</div>
                {s.change && (
                  <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${s.up ? 'text-success' : 'text-danger'}`}>
                    <TrendingUp size={11} className={s.up ? '' : 'rotate-180'} /> {s.change} vs. mês anterior
                  </div>
                )}
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={18} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 bg-white border border-[#E2E8F0] rounded-xl mb-5 w-fit">
        {[['overview','📊 Visão Geral'],['ranking','🏆 Ranking'],['ministry','⛪ Por Ministério']].map(([k,l]) => (
          <button key={k} onClick={() => setActiveTab(k as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === k ? 'bg-secondary text-white shadow-sm' : 'text-muted hover:text-[#020617]'}`}>
            {l}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Bar chart - monthly presence */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-[#020617]">Taxa de Presença Mensal</h3>
              <span className="badge bg-[#F0FDF4] text-success">2025</span>
            </div>
            <div className="flex items-end gap-1.5 h-36">
              {PRESENCE_DATA.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[9px] font-bold text-muted">{v}%</div>
                  <div
                    className="w-full rounded-t-md transition-all duration-500"
                    style={{
                      height: `${(v / maxPresence) * 100}%`,
                      background: i === 11 ? '#2563EB' : '#DBEAFE',
                      border: i === 11 ? 'none' : '1px solid #BFDBFE',
                    }}
                  />
                  <div className="text-[9px] font-semibold text-muted">{MONTHS[i]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Presence by ministry */}
          <div className="card">
            <h3 className="text-base font-bold text-[#020617] mb-4">Presença por Ministério</h3>
            <div className="space-y-3.5">
              {MINISTRIES_DATA.map(m => (
                <div key={m.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-[#334155]">{m.name}</span>
                    <span className="text-sm font-bold" style={{ color: m.color }}>{m.presence}%</span>
                  </div>
                  <Bar value={m.presence} color={m.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="card lg:col-span-2">
            <h3 className="text-base font-bold text-[#020617] mb-4">Resumo do Período</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total de Escalas',    value: '284', icon: '📅' },
                { label: 'Presenças Confirmadas',value: '259', icon: '✅' },
                { label: 'Ausências',            value: '25',  icon: '❌' },
                { label: 'Trocas Realizadas',   value: '12',  icon: '🔄' },
                { label: 'Feedbacks Enviados',  value: '38',  icon: '💬' },
                { label: 'Check-ins no Prazo',  value: '91%', icon: '⏰' },
                { label: 'Novos Voluntários',   value: '4',   icon: '👤' },
                { label: 'Pontos Distribuídos', value: '1.240',icon: '⭐' },
              ].map(s => (
                <div key={s.label} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] text-center">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="text-xl font-display font-extrabold text-[#020617]">{s.value}</div>
                  <div className="text-xs text-muted mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ranking' && (
        <div className="card overflow-hidden p-0">
          <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            <h3 className="font-bold text-[#020617]">Ranking de Voluntários — {period}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#F1F5F9]">
                  {['Pos.','Voluntário','Ministério','Presenças','Faltas','Pontos','Tier','Tendência'].map(h => (
                    <th key={h} className="text-left text-[11px] font-bold text-muted uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RANKING.map((v, i) => {
                  const tier  = getPointsTier(v.points)
                  const color = getAvatarColor(v.name)
                  return (
                    <tr key={v.name} className="border-b border-[#F8FAFC] hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="text-base">{i < 3 ? ['🥇','🥈','🥉'][i] : <span className="text-sm font-bold text-muted">#{i+1}</span>}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: color }}>
                            {getInitials(v.name)}
                          </div>
                          <span className="text-sm font-semibold">{v.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="badge bg-[#EFF6FF] text-secondary">{v.ministry}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-bold text-success">{v.attended}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-bold text-danger">{v.absent}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold">{v.points.toLocaleString('pt-BR')}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="badge text-xs font-bold" style={{ background: `${tier.color}18`, color: tier.color }}>
                          {tier.icon} {tier.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-success font-bold text-lg">↑</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ministry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {MINISTRIES_DATA.map(m => (
            <div key={m.name} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-sm text-[#020617]">{m.name}</div>
                <span className="text-lg font-display font-extrabold" style={{ color: m.color }}>{m.presence}%</span>
              </div>
              <Bar value={m.presence} color={m.color} />
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[
                  { label: 'Membros', value: m.members },
                  { label: 'Eventos', value: m.events },
                  { label: 'Ausências', value: Math.round(m.members * (1 - m.presence / 100)) },
                ].map(s => (
                  <div key={s.label} className="text-center p-2.5 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9]">
                    <div className="text-base font-bold text-[#020617]">{s.value}</div>
                    <div className="text-[10px] text-muted font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
