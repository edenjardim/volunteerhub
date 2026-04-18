import { getSupabaseClient, handleSupabaseError } from './supabase'
import type {
  User, Ministry, Event, Schedule, ScheduleSwap,
  Attendance, Feedback, Notification,
  CreateUserDto, UpdateUserDto, CreateMinistryDto,
  CreateEventDto, CreateScheduleDto, CreateFeedbackDto,
} from '@/types'

const supabase = getSupabaseClient()

// ── Users ──────────────────────────────────────────────────
export const usersApi = {
  list: async (params?: Record<string, string>) => {
    let query = supabase.from('users').select('*')
    
    if (params?.ministry_id) {
      query = query.in('id', 
        supabase.from('ministry_members')
          .select('user_id')
          .eq('ministry_id', params.ministry_id)
      )
    }
    
    if (params?.role) {
      query = query.eq('role', params.role)
    }
    
    const result = await query.order('name')
    return { data: handleSupabaseError(result) }
  },

  get: async (id: string) => {
    const result = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  create: async (dto: CreateUserDto) => {
    const result = await supabase
      .from('users')
      .insert(dto)
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  update: async (id: string, dto: UpdateUserDto) => {
    const result = await supabase
      .from('users')
      .update(dto)
      .eq('id', id)
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  delete: async (id: string) => {
    const result = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    handleSupabaseError(result)
    return { data: null }
  },

  updateAvatar: async (id: string, file: File) => {
    const path = `avatars/${id}-${Date.now()}.${file.name.split('.').pop()}`
    
    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })
    
    if (error) throw error
    
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const avatar_url = data.publicUrl
    
    await supabase
      .from('users')
      .update({ avatar_url })
      .eq('id', id)
    
    return { data: { avatar_url } }
  },

  getStats: async (id: string) => {
    // Calcula taxa de presença
    const { data: attendances } = await supabase
      .from('attendance')
      .select('present')
      .eq('user_id', id)
    
    const total = attendances?.length || 0
    const present = attendances?.filter(a => a.present).length || 0
    const presence_rate = total > 0 ? (present / total) * 100 : 0
    
    // Busca pontos
    const { data: user } = await supabase
      .from('users')
      .select('points')
      .eq('id', id)
      .single()
    
    const points = user?.points || 0
    
    // Calcula ranking (quantos têm mais pontos que você)
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gt('points', points)
    
    const rank = (count || 0) + 1
    
    return { data: { presence_rate, points, rank } }
  },
}

// ── Ministries ─────────────────────────────────────────────
export const ministriesApi = {
  list: async () => {
    const result = await supabase
      .from('ministries')
      .select(`
        *,
        leader:users!ministries_leader_id_fkey(id, name, avatar_url),
        members:ministry_members(count)
      `)
      .order('name')
    
    return { data: handleSupabaseError(result) }
  },

  get: async (id: string) => {
    const result = await supabase
      .from('ministries')
      .select(`
        *,
        leader:users!ministries_leader_id_fkey(id, name, avatar_url, email),
        members:ministry_members(
          id,
          role,
          priority,
          joined_at,
          user:users(id, name, avatar_url, email, skills)
        )
      `)
      .eq('id', id)
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  create: async (dto: CreateMinistryDto) => {
    // Pega church_id do usuário atual
    const { data: { user } } = await supabase.auth.getUser()
    const { data: currentUser } = await supabase
      .from('users')
      .select('church_id')
      .eq('id', user?.id)
      .single()
    
    const result = await supabase
      .from('ministries')
      .insert({ ...dto, church_id: currentUser?.church_id })
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  update: async (id: string, dto: Partial<CreateMinistryDto>) => {
    const result = await supabase
      .from('ministries')
      .update(dto)
      .eq('id', id)
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  delete: async (id: string) => {
    const result = await supabase
      .from('ministries')
      .delete()
      .eq('id', id)
    
    handleSupabaseError(result)
    return { data: null }
  },

  addMember: async (id: string, userId: string, role: string) => {
    const result = await supabase
      .from('ministry_members')
      .insert({
        ministry_id: id,
        user_id: userId,
        role,
      })
      .select()
    
    return { data: handleSupabaseError(result) }
  },

  removeMember: async (id: string, userId: string) => {
    const result = await supabase
      .from('ministry_members')
      .delete()
      .eq('ministry_id', id)
      .eq('user_id', userId)
    
    handleSupabaseError(result)
    return { data: null }
  },
}

// ── Events ─────────────────────────────────────────────────
export const eventsApi = {
  list: async (params?: Record<string, string>) => {
    let query = supabase
      .from('events')
      .select(`
        *,
        created_by_user:users!events_created_by_fkey(id, name),
        schedules(count)
      `)
    
    if (params?.from && params?.to) {
      query = query
        .gte('event_date', params.from)
        .lte('event_date', params.to)
    }
    
    if (params?.type) {
      query = query.eq('type', params.type)
    }
    
    const result = await query.order('event_date', { ascending: true })
    return { data: handleSupabaseError(result) }
  },

  get: async (id: string) => {
    const result = await supabase
      .from('events')
      .select(`
        *,
        created_by_user:users!events_created_by_fkey(id, name),
        content:event_content(*),
        schedules(
          *,
          volunteer:users(id, name, avatar_url),
          ministry:ministries(id, name, color, icon)
        )
      `)
      .eq('id', id)
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  create: async (dto: CreateEventDto) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: currentUser } = await supabase
      .from('users')
      .select('church_id')
      .eq('id', user?.id)
      .single()
    
    const result = await supabase
      .from('events')
      .insert({
        ...dto,
        church_id: currentUser?.church_id,
        created_by: user?.id,
      })
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  update: async (id: string, dto: Partial<CreateEventDto>) => {
    const result = await supabase
      .from('events')
      .update(dto)
      .eq('id', id)
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  delete: async (id: string) => {
    const result = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    
    handleSupabaseError(result)
    return { data: null }
  },

  uploadContent: async (id: string, file: File, type: string, title: string) => {
    const path = `events/${id}/${Date.now()}-${file.name}`
    
    const { error } = await supabase.storage
      .from('event-files')
      .upload(path, file)
    
    if (error) throw error
    
    const { data } = supabase.storage.from('event-files').getPublicUrl(path)
    
    const result = await supabase
      .from('event_content')
      .insert({
        event_id: id,
        type,
        title,
        url: data.publicUrl,
      })
      .select()
    
    return { data: handleSupabaseError(result) }
  },

  addChord: async (id: string, title: string, content: string, tone: string) => {
    const result = await supabase
      .from('event_content')
      .insert({
        event_id: id,
        type: 'chord',
        title,
        content,
        tone,
      })
      .select()
    
    return { data: handleSupabaseError(result) }
  },

  transposeChord: async (content: string, from: string, to: string) => {
    // Implementação simplificada de transposição
    // Em produção, usar biblioteca específica
    return { data: { content } }
  },
}

// ── Schedules ──────────────────────────────────────────────
export const schedulesApi = {
  list: async (params?: Record<string, string>) => {
    let query = supabase
      .from('schedules')
      .select(`
        *,
        volunteer:users(id, name, avatar_url),
        ministry:ministries(id, name, color, icon),
        event:events(id, title, event_date)
      `)
    
    if (params?.event_id) {
      query = query.eq('event_id', params.event_id)
    }
    
    if (params?.volunteer_id) {
      query = query.eq('volunteer_id', params.volunteer_id)
    }
    
    if (params?.ministry_id) {
      query = query.eq('ministry_id', params.ministry_id)
    }
    
    if (params?.status) {
      query = query.eq('status', params.status)
    }
    
    const result = await query.order('created_at', { ascending: false })
    return { data: handleSupabaseError(result) }
  },

  get: async (id: string) => {
    const result = await supabase
      .from('schedules')
      .select(`
        *,
        volunteer:users(id, name, avatar_url, email),
        ministry:ministries(id, name, color, icon),
        event:events(id, title, event_date, description)
      `)
      .eq('id', id)
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  create: async (dto: CreateScheduleDto) => {
    const result = await supabase
      .from('schedules')
      .insert(dto)
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  bulkCreate: async (schedules: CreateScheduleDto[]) => {
    const result = await supabase
      .from('schedules')
      .insert(schedules)
      .select()
    
    return { data: handleSupabaseError(result) }
  },

  update: async (id: string, dto: Partial<CreateScheduleDto>) => {
    const result = await supabase
      .from('schedules')
      .update(dto)
      .eq('id', id)
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  delete: async (id: string) => {
    const result = await supabase
      .from('schedules')
      .delete()
      .eq('id', id)
    
    handleSupabaseError(result)
    return { data: null }
  },

  confirm: async (id: string) => {
    const result = await supabase
      .from('schedules')
      .update({ status: 'confirmed' })
      .eq('id', id)
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  checkIn: async (id: string) => {
    const result = await supabase
      .from('schedules')
      .update({ checked_in_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  generateAI: async (eventId: string, options?: any) => {
    // Placeholder - implementar lógica de IA ou remover
    return { data: [] }
  },

  publishAI: async (eventId: string, suggestions: any[]) => {
    // Placeholder - implementar lógica de IA ou remover
    return { data: [] }
  },
}

// ── Swaps ──────────────────────────────────────────────────
export const swapsApi = {
  list: async () => {
    const result = await supabase
      .from('schedule_swaps')
      .select(`
        *,
        requester:users!schedule_swaps_requester_id_fkey(id, name, avatar_url),
        substitute:users!schedule_swaps_substitute_id_fkey(id, name, avatar_url),
        schedule:schedules(
          *,
          event:events(id, title, event_date),
          ministry:ministries(id, name)
        )
      `)
      .order('created_at', { ascending: false })
    
    return { data: handleSupabaseError(result) }
  },

  request: async (scheduleId: string, reason?: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const result = await supabase
      .from('schedule_swaps')
      .insert({
        schedule_id: scheduleId,
        requester_id: user?.id,
        reason,
      })
      .select()
      .single()
    
    // Atualiza status da escala
    await supabase
      .from('schedules')
      .update({ status: 'swap_requested' })
      .eq('id', scheduleId)
    
    return { data: handleSupabaseError(result) }
  },

  accept: async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const result = await supabase
      .from('schedule_swaps')
      .update({
        status: 'accepted',
        substitute_id: user?.id,
      })
      .eq('id', id)
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  reject: async (id: string) => {
    const result = await supabase
      .from('schedule_swaps')
      .update({ status: 'rejected' })
      .eq('id', id)
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  leaderApprove: async (id: string) => {
    const { data: swap } = await supabase
      .from('schedule_swaps')
      .select('schedule_id, substitute_id')
      .eq('id', id)
      .single()
    
    if (!swap) throw new Error('Troca não encontrada')
    
    // Atualiza a escala com o substituto
    await supabase
      .from('schedules')
      .update({
        volunteer_id: swap.substitute_id,
        status: 'confirmed',
      })
      .eq('id', swap.schedule_id)
    
    // Marca troca como aprovada
    const result = await supabase
      .from('schedule_swaps')
      .update({ status: 'leader_approved' })
      .eq('id', id)
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },
}

// ── Attendance ─────────────────────────────────────────────
export const attendanceApi = {
  record: async (scheduleId: string, present: boolean, onTime?: boolean) => {
    const { data: schedule } = await supabase
      .from('schedules')
      .select('volunteer_id, event_id')
      .eq('id', scheduleId)
      .single()
    
    if (!schedule) throw new Error('Escala não encontrada')
    
    const points_earned = present ? (onTime ? 10 : 5) : 0
    
    const result = await supabase
      .from('attendance')
      .upsert({
        schedule_id: scheduleId,
        user_id: schedule.volunteer_id,
        event_id: schedule.event_id,
        present,
        on_time: onTime,
        points_earned,
      }, {
        onConflict: 'schedule_id,user_id'
      })
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  getByEvent: async (eventId: string) => {
    const result = await supabase
      .from('attendance')
      .select(`
        *,
        user:users(id, name, avatar_url),
        schedule:schedules(
          *,
          ministry:ministries(id, name)
        )
      `)
      .eq('event_id', eventId)
    
    return { data: handleSupabaseError(result) }
  },

  getByUser: async (userId: string) => {
    const result = await supabase
      .from('attendance')
      .select(`
        *,
        event:events(id, title, event_date),
        schedule:schedules(
          *,
          ministry:ministries(id, name)
        )
      `)
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
    
    return { data: handleSupabaseError(result) }
  },
}

// ── Feedback ───────────────────────────────────────────────
export const feedbackApi = {
  create: async (dto: CreateFeedbackDto) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const result = await supabase
      .from('feedbacks')
      .insert({
        ...dto,
        from_user_id: user?.id,
      })
      .select()
      .single()
    
    return { data: handleSupabaseError(result) }
  },

  getByUser: async (userId: string) => {
    const result = await supabase
      .from('feedbacks')
      .select(`
        *,
        from_user:users!feedbacks_from_user_id_fkey(id, name, avatar_url),
        event:events(id, title)
      `)
      .eq('to_user_id', userId)
      .order('created_at', { ascending: false })
    
    return { data: handleSupabaseError(result) }
  },

  getSent: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const result = await supabase
      .from('feedbacks')
      .select(`
        *,
        to_user:users!feedbacks_to_user_id_fkey(id, name, avatar_url),
        event:events(id, title)
      `)
      .eq('from_user_id', user?.id)
      .order('created_at', { ascending: false })
    
    return { data: handleSupabaseError(result) }
  },
}

// ── Notifications ──────────────────────────────────────────
export const notificationsApi = {
  list: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const result = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(50)
    
    return { data: handleSupabaseError(result) }
  },

  markRead: async (id: string) => {
    const result = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
    
    handleSupabaseError(result)
    return { data: null }
  },

  markAllRead: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const result = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user?.id)
      .eq('read', false)
    
    handleSupabaseError(result)
    return { data: null }
  },

  delete: async (id: string) => {
    const result = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
    
    handleSupabaseError(result)
    return { data: null }
  },
}

// ── Reports (simplificado) ─────────────────────────────────
export const reportsApi = {
  presence: async (params?: { month?: string; ministry_id?: string }) => {
    // Implementação simplificada - queries agregadas
    return { data: [] }
  },

  ministries: async (params?: { month?: string }) => {
    return { data: [] }
  },

  monthly: async () => {
    return { data: [] }
  },

  exportPDF: async (type: string, params?: Record<string, string>) => {
    throw new Error('Export PDF não implementado ainda')
  },

  exportExcel: async (type: string, params?: Record<string, string>) => {
    throw new Error('Export Excel não implementado ainda')
  },
}

// Export default vazio para compatibilidade
export default {}
