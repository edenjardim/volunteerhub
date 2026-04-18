"use client"
console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

const supabase = createClient()

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 🔄 LOAD
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')

      if (error) {
        console.error(error)
        toast.error('Erro ao carregar dados')
      } else {
        setSchedules(data || [])
      }

      setLoading(false)
    }

    load()
  }, [])

  // ➕ CREATE
  const createSchedule = async () => {
    const newItem = {
      title: 'Novo Evento',
      date: new Date().toISOString(),
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('schedules')
      .insert([newItem])
      .select()

    if (error) {
      toast.error('Erro ao criar')
      return
    }

    setSchedules(prev => [...prev, ...data])
    toast.success('Criado com sucesso')
  }

  // ✏️ UPDATE
  const updateSchedule = async (id: string) => {
    const { data, error } = await supabase
      .from('schedules')
      .update({ title: 'Atualizado' })
      .eq('id', id)
      .select()

    if (error) {
      toast.error('Erro ao atualizar')
      return
    }

    setSchedules(prev =>
      prev.map(item => item.id === id ? data[0] : item)
    )

    toast.success('Atualizado')
  }

  // 🗑 DELETE
  const deleteSchedule = async (id: string) => {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Erro ao excluir')
      return
    }

    setSchedules(prev => prev.filter(item => item.id !== id))
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
            {s.title}
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
