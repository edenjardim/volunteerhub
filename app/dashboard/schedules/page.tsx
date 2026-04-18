"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

const supabase = createClient()

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 🔄 LOAD (reutilizável)
  const loadSchedules = async () => {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')

    if (error) {
      console.error(error)
      toast.error('Erro ao carregar dados')
      return
    }

    setSchedules(data || [])
  }

  useEffect(() => {
    loadSchedules().finally(() => setLoading(false))
  }, [])

  // ➕ CREATE (AGORA COMPATÍVEL COM SUA TABELA)
  const createSchedule = async () => {
    const newItem = {
      event_id: crypto.randomUUID(),     // gera ID válido
      ministry_id: crypto.randomUUID(),
      volunteer_id: crypto.randomUUID(),
      role: 'Teste',
      status: 'pending'
    }

    const { error } = await supabase
      .from('schedules')
      .insert([newItem])

    if (error) {
      console.error(error)
      toast.error('Erro ao criar')
      return
    }

    await loadSchedules()
    toast.success('Criado com sucesso')
  }

  // ✏️ UPDATE
  const updateSchedule = async (id: string) => {
    const { error } = await supabase
      .from('schedules')
      .update({ role: 'Atualizado' })
      .eq('id', id)

    if (error) {
      console.error(error)
      toast.error('Erro ao atualizar')
      return
    }

    await loadSchedules()
    toast.success('Atualizado')
  }

  // 🗑 DELETE
  const deleteSchedule = async (id: string) => {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      toast.error('Erro ao excluir')
      return
    }

    await loadSchedules()
    toast.success('Excluído')
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div style={{ padding: 20 }}>
      <h1>Schedules (Supabase)</h1>

      <button onClick={createSchedule}>
        Criar
      </button>

      <ul>
        {schedules.map(s => (
          <li key={s.id} style={{ marginTop: 10 }}>
            {s.role || 'Sem função'}
            <button onClick={() => updateSchedule(s.id)} style={{ marginLeft: 10 }}>
              Editar
            </button>
            <button onClick={() => deleteSchedule(s.id)} style={{ marginLeft: 10 }}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
