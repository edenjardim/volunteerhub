'use client'

import { useState } from 'react'
import { Save, Bell, Shield, Database, Upload, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppStore } from '@/store'
import { signOut } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const Toggle = ({ value, onChange, label, description }: { value: boolean; onChange: (v: boolean) => void; label: string; description?: string }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-[#F8FAFC] last:border-0">
    <div>
      <div className="text-sm font-semibold text-[#334155]">{label}</div>
      {description && <div className="text-xs text-muted mt-0.5">{description}</div>}
    </div>
    <button
      onClick={() => onChange(!value)}
      className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
      style={{ background: value ? '#2563EB' : '#E2E8F0' }}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
)

export default function SettingsPage() {
  const router  = useRouter()
  const { user } = useAppStore()
  const [tab, setTab] = useState<'church'|'notifications'|'security'|'system'>('church')

  // Church settings
  const [churchName,  setChurchName]  = useState('Igreja Comunidade da Graça')
  const [pastor,      setPastor]      = useState('Pastor André Silva')
  const [city,        setCity]        = useState('São Paulo, SP')
  const [website,     setWebsite]     = useState('www.comunidadedagraca.com.br')
  const [phone,       setPhone]       = useState('(11) 3333-4444')

  // Notification prefs
  const [emailNotif,    setEmailNotif]    = useState(true)
  const [whatsappNotif, setWhatsappNotif] = useState(false)
  const [scheduleReminder, setScheduleReminder] = useState(true)
  const [swapNotif,     setSwapNotif]     = useState(true)
  const [weeklyReport,  setWeeklyReport]  = useState(false)
  const [feedbackNotif, setFeedbackNotif] = useState(true)

  // System
  const [autoSave,     setAutoSave]     = useState(true)
  const [confirmDelete,setConfirmDelete] = useState(true)
  const [darkMode,     setDarkMode]     = useState(false)
  const [aiSuggest,    setAiSuggest]    = useState(true)

  // Point rules
  const [pointsPresence,   setPointsPresence]   = useState(10)
  const [pointsPunctuality,setPointsPunctuality] = useState(5)
  const [pointsLeader,     setPointsLeader]     = useState(20)

  const handleSaveChurch = () => toast.success('Configurações da igreja salvas! ✅')
  const handleSaveNotif  = () => toast.success('Preferências de notificação salvas! 🔔')
  const handleSaveSystem = () => toast.success('Configurações do sistema salvas! ⚙️')
  const handleLogout     = async () => { await signOut(); router.push('/auth/login') }

  const TABS = [
    { key: 'church',        label: '⛪ Igreja' },
    { key: 'notifications', label: '🔔 Notificações' },
    { key: 'security',      label: '🔒 Segurança' },
    { key: 'system',        label: '⚙️ Sistema' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Configurações</h1>
        <p className="text-sm text-muted mt-1">Personalize a plataforma para sua igreja</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0">
          <div className="card p-2 space-y-0.5">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key as any)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === t.key ? 'bg-secondary/10 text-secondary' : 'text-muted hover:bg-[#F8FAFC] hover:text-[#020617]'
                }`}>
                {t.label}
              </button>
            ))}
            <div className="pt-2 mt-2 border-t border-[#F1F5F9]">
              <button onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-danger hover:bg-[#FEF2F2] transition-all flex items-center gap-2">
                <LogOut size={14} /> Sair
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">
          {tab === 'church' && (
            <div className="card">
              <h2 className="text-base font-bold mb-1">Perfil da Igreja</h2>
              <p className="text-sm text-muted mb-5">Informações exibidas para todos os voluntários</p>

              {/* Logo upload */}
              <div className="flex items-center gap-4 mb-5 p-4 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white text-2xl shadow">⛪</div>
                <div>
                  <div className="text-sm font-semibold mb-1">Logo da Igreja</div>
                  <button className="btn btn-secondary text-xs gap-1.5"><Upload size={12} /> Fazer Upload</button>
                  <div className="text-xs text-muted mt-1">PNG, JPG até 2MB</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-1.5">Nome da Igreja *</label>
                  <input className="input" value={churchName} onChange={e => setChurchName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-1.5">Pastor / Líder Principal</label>
                  <input className="input" value={pastor} onChange={e => setPastor(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-1.5">Cidade</label>
                  <input className="input" value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-1.5">Telefone</label>
                  <input className="input" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-[#374151] mb-1.5">Website</label>
                  <input className="input" value={website} onChange={e => setWebsite(e.target.value)} />
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#F1F5F9]">
                <h3 className="text-sm font-bold mb-3">Sistema de Pontuação</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Pontos por Presença',    value: pointsPresence,    set: setPointsPresence },
                    { label: 'Pontos por Pontualidade',value: pointsPunctuality, set: setPointsPunctuality },
                    { label: 'Pontos Bônus (Líder)',   value: pointsLeader,      set: setPointsLeader },
                  ].map(s => (
                    <div key={s.label}>
                      <label className="block text-xs font-semibold text-muted mb-1.5">{s.label}</label>
                      <input type="number" className="input" value={s.value} onChange={e => s.set(Number(e.target.value))} min={0} max={100} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-5">
                <button onClick={handleSaveChurch} className="btn btn-primary gap-2">
                  <Save size={15} /> Salvar Configurações
                </button>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-center gap-2 mb-1"><Bell size={16} className="text-secondary" /><h2 className="text-base font-bold">Canais de Notificação</h2></div>
                <p className="text-sm text-muted mb-4">Configure como os voluntários receberão avisos</p>
                <Toggle value={emailNotif}    onChange={setEmailNotif}    label="📧 Notificações por E-mail"    description="Enviado via Resend — 100 e-mails/dia no plano gratuito" />
                <Toggle value={whatsappNotif} onChange={setWhatsappNotif} label="📱 Notificações por WhatsApp"  description="Requer que cada voluntário ative o CallMeBot (1x)" />
              </div>
              <div className="card">
                <h2 className="text-base font-bold mb-4">Tipos de Notificação</h2>
                <Toggle value={scheduleReminder} onChange={setScheduleReminder} label="📅 Lembrete de Escala"      description="Enviado 24h antes do evento" />
                <Toggle value={swapNotif}        onChange={setSwapNotif}        label="🔄 Solicitações de Troca"   description="Notifica líder e voluntários envolvidos" />
                <Toggle value={feedbackNotif}    onChange={setFeedbackNotif}    label="💬 Novos Feedbacks"         description="Quando líder ou voluntário envia feedback" />
                <Toggle value={weeklyReport}     onChange={setWeeklyReport}     label="📊 Relatório Semanal"       description="Resumo enviado toda segunda-feira" />
              </div>
              <div className="card">
                <h2 className="text-base font-bold mb-2">Configurar WhatsApp (CallMeBot)</h2>
                <div className="p-4 bg-[#FFFBEB] border border-amber-200 rounded-xl mb-4">
                  <div className="text-sm font-semibold text-amber-800 mb-1">⚠️ Configuração necessária por voluntário</div>
                  <div className="text-xs text-amber-700 space-y-1">
                    <p>1. Salvar o número <strong>+34 644 61 66 22</strong> como contato "CallMeBot"</p>
                    <p>2. Enviar a mensagem: <code className="bg-amber-100 px-1 rounded">I allow callmebot to send me messages</code></p>
                    <p>3. Receberá a API Key por WhatsApp</p>
                    <p>4. Cadastrar a API Key no perfil do app</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Número de Teste</label>
                    <input className="input" placeholder="+5511999990000" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">API Key de Teste</label>
                    <input className="input" placeholder="Sua API Key" />
                  </div>
                </div>
                <button onClick={() => toast.success('Mensagem de teste enviada! 📱')} className="btn btn-secondary mt-3 gap-1.5 text-sm">
                  Enviar Mensagem de Teste
                </button>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSaveNotif} className="btn btn-primary gap-2"><Save size={15} /> Salvar</button>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-center gap-2 mb-4"><Shield size={16} className="text-secondary" /><h2 className="text-base font-bold">Senha e Acesso</h2></div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#374151] mb-1.5">Senha Atual</label>
                    <input type="password" className="input" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#374151] mb-1.5">Nova Senha</label>
                    <input type="password" className="input" placeholder="Mínimo 8 caracteres" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#374151] mb-1.5">Confirmar Nova Senha</label>
                    <input type="password" className="input" placeholder="Repita a nova senha" />
                  </div>
                  <button onClick={() => toast.success('Senha alterada com sucesso!')} className="btn btn-primary">Alterar Senha</button>
                </div>
              </div>
              <div className="card">
                <h2 className="text-base font-bold mb-2">Sessões Ativas</h2>
                <p className="text-sm text-muted mb-4">Dispositivos com sessão aberta</p>
                {[
                  { device: 'Chrome — MacBook Pro', location: 'São Paulo, SP', time: 'Agora', current: true },
                  { device: 'Chrome — iPhone 14',   location: 'São Paulo, SP', time: '2h atrás', current: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[#F8FAFC] last:border-0">
                    <div>
                      <div className="text-sm font-semibold">{s.device} {s.current && <span className="badge bg-[#F0FDF4] text-success ml-1.5">Atual</span>}</div>
                      <div className="text-xs text-muted">{s.location} • {s.time}</div>
                    </div>
                    {!s.current && <button onClick={() => toast('Sessão encerrada.')} className="btn btn-danger text-xs py-1 px-2">Encerrar</button>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'system' && (
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-center gap-2 mb-4"><Database size={16} className="text-secondary" /><h2 className="text-base font-bold">Preferências do Sistema</h2></div>
                <Toggle value={autoSave}      onChange={setAutoSave}      label="💾 Auto-save ativado"              description="Salva automaticamente ao sair de cada campo" />
                <Toggle value={confirmDelete} onChange={setConfirmDelete} label="🔒 Confirmar antes de excluir"    description="Exibe diálogo de confirmação em exclusões" />
                <Toggle value={aiSuggest}     onChange={setAiSuggest}     label="✨ Sugestões de IA"               description="Habilita geração automática de escalas por IA" />
                <Toggle value={darkMode}      onChange={setDarkMode}      label="🌙 Modo Escuro"                   description="Em breve — interface no tema escuro" />
              </div>
              <div className="card">
                <h2 className="text-base font-bold mb-4">Logs e Auditoria</h2>
                <p className="text-sm text-muted mb-4">Registro de todas as ações realizadas na plataforma</p>
                <div className="space-y-2">
                  {[
                    { action: 'Escala criada',         user: 'Pastor André', time: '19 Jan, 14:32', type: 'create' },
                    { action: 'Voluntário adicionado', user: 'Pastor André', time: '18 Jan, 10:15', type: 'create' },
                    { action: 'Troca aprovada',         user: 'Maria Oliveira', time: '17 Jan, 09:40', type: 'update' },
                    { action: 'Feedback enviado',       user: 'João Santos', time: '15 Jan, 20:22', type: 'create' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9] text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${log.type === 'create' ? 'bg-success' : 'bg-secondary'}`} />
                      <span className="font-semibold flex-1">{log.action}</span>
                      <span className="text-muted">{log.user}</span>
                      <span className="text-muted/60">{log.time}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => toast.success('Logs exportados!')} className="btn btn-secondary text-xs mt-3 gap-1.5">
                  <Database size={12} /> Exportar Todos os Logs
                </button>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSaveSystem} className="btn btn-primary gap-2"><Save size={15} /> Salvar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
