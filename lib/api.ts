import axios, { AxiosError } from 'axios'
import { getSession } from './supabase'
import type {
  User, Ministry, Event, Schedule, ScheduleSwap,
  Attendance, Feedback, Notification, PresenceReport,
  MinistryReport, MonthlyStats, AIScheduleSuggestion,
  CreateUserDto, UpdateUserDto, CreateMinistryDto,
  CreateEventDto, CreateScheduleDto, CreateFeedbackDto,
  ApiResponse,
} from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// ── Users ──────────────────────────────────────────────────
export const usersApi = {
  list: (params?: Record<string, string>) =>
    api.get<ApiResponse<User[]>>('/users', { params }),

  get: (id: string) =>
    api.get<User>(`/users/${id}`),

  create: (dto: CreateUserDto) =>
    api.post<User>('/users', dto),

  update: (id: string, dto: UpdateUserDto) =>
    api.patch<User>(`/users/${id}`, dto),

  delete: (id: string) =>
    api.delete(`/users/${id}`),

  updateAvatar: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<{ avatar_url: string }>(`/users/${id}/avatar`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getStats: (id: string) =>
    api.get<{ presence_rate: number; points: number; rank: number }>(`/users/${id}/stats`),
}

// ── Ministries ─────────────────────────────────────────────
export const ministriesApi = {
  list: () =>
    api.get<ApiResponse<Ministry[]>>('/ministries'),

  get: (id: string) =>
    api.get<Ministry>(`/ministries/${id}`),

  create: (dto: CreateMinistryDto) =>
    api.post<Ministry>('/ministries', dto),

  update: (id: string, dto: Partial<CreateMinistryDto>) =>
    api.patch<Ministry>(`/ministries/${id}`, dto),

  delete: (id: string) =>
    api.delete(`/ministries/${id}`),

  addMember: (id: string, userId: string, role: string) =>
    api.post(`/ministries/${id}/members`, { user_id: userId, role }),

  removeMember: (id: string, userId: string) =>
    api.delete(`/ministries/${id}/members/${userId}`),
}

// ── Events ─────────────────────────────────────────────────
export const eventsApi = {
  list: (params?: Record<string, string>) =>
    api.get<ApiResponse<Event[]>>('/events', { params }),

  get: (id: string) =>
    api.get<Event>(`/events/${id}`),

  create: (dto: CreateEventDto) =>
    api.post<Event>('/events', dto),

  update: (id: string, dto: Partial<CreateEventDto>) =>
    api.patch<Event>(`/events/${id}`, dto),

  delete: (id: string) =>
    api.delete(`/events/${id}`),

  uploadContent: (id: string, file: File, type: string, title: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('type', type)
    form.append('title', title)
    return api.post(`/events/${id}/content`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  addChord: (id: string, title: string, content: string, tone: string) =>
    api.post(`/events/${id}/content`, { type: 'chord', title, content, tone }),

  transposeChord: (content: string, from: string, to: string) =>
    api.post<{ content: string }>('/events/transpose', { content, from, to }),
}

// ── Schedules ──────────────────────────────────────────────
export const schedulesApi = {
  list: (params?: Record<string, string>) =>
    api.get<ApiResponse<Schedule[]>>('/schedules', { params }),

  get: (id: string) =>
    api.get<Schedule>(`/schedules/${id}`),

  create: (dto: CreateScheduleDto) =>
    api.post<Schedule>('/schedules', dto),

  bulkCreate: (schedules: CreateScheduleDto[]) =>
    api.post<Schedule[]>('/schedules/bulk', { schedules }),

  update: (id: string, dto: Partial<CreateScheduleDto>) =>
    api.patch<Schedule>(`/schedules/${id}`, dto),

  delete: (id: string) =>
    api.delete(`/schedules/${id}`),

  confirm: (id: string) =>
    api.patch<Schedule>(`/schedules/${id}/confirm`),

  checkIn: (id: string) =>
    api.patch<Schedule>(`/schedules/${id}/checkin`),

  generateAI: (eventId: string, options?: { balance: boolean; skills: boolean }) =>
    api.post<AIScheduleSuggestion[]>('/schedules/generate-ai', { event_id: eventId, ...options }),

  publishAI: (eventId: string, suggestions: AIScheduleSuggestion[]) =>
    api.post<Schedule[]>('/schedules/publish-ai', { event_id: eventId, suggestions }),
}

// ── Swaps ──────────────────────────────────────────────────
export const swapsApi = {
  list: () =>
    api.get<ApiResponse<ScheduleSwap[]>>('/swaps'),

  request: (scheduleId: string, reason?: string) =>
    api.post<ScheduleSwap>('/swaps', { schedule_id: scheduleId, reason }),

  accept: (id: string) =>
    api.patch<ScheduleSwap>(`/swaps/${id}/accept`),

  reject: (id: string) =>
    api.patch<ScheduleSwap>(`/swaps/${id}/reject`),

  leaderApprove: (id: string) =>
    api.patch<ScheduleSwap>(`/swaps/${id}/approve`),
}

// ── Attendance ─────────────────────────────────────────────
export const attendanceApi = {
  record: (scheduleId: string, present: boolean, onTime?: boolean) =>
    api.post<Attendance>('/attendance', { schedule_id: scheduleId, present, on_time: onTime }),

  getByEvent: (eventId: string) =>
    api.get<Attendance[]>(`/attendance/event/${eventId}`),

  getByUser: (userId: string) =>
    api.get<Attendance[]>(`/attendance/user/${userId}`),
}

// ── Feedback ───────────────────────────────────────────────
export const feedbackApi = {
  create: (dto: CreateFeedbackDto) =>
    api.post<Feedback>('/feedback', dto),

  getByUser: (userId: string) =>
    api.get<Feedback[]>(`/feedback/user/${userId}`),

  getSent: () =>
    api.get<Feedback[]>('/feedback/sent'),
}

// ── Notifications ──────────────────────────────────────────
export const notificationsApi = {
  list: () =>
    api.get<ApiResponse<Notification[]>>('/notifications'),

  markRead: (id: string) =>
    api.patch(`/notifications/${id}/read`),

  markAllRead: () =>
    api.patch('/notifications/read-all'),

  delete: (id: string) =>
    api.delete(`/notifications/${id}`),
}

// ── Reports ────────────────────────────────────────────────
export const reportsApi = {
  presence: (params?: { month?: string; ministry_id?: string }) =>
    api.get<PresenceReport[]>('/reports/presence', { params }),

  ministries: (params?: { month?: string }) =>
    api.get<MinistryReport[]>('/reports/ministries', { params }),

  monthly: () =>
    api.get<MonthlyStats[]>('/reports/monthly'),

  exportPDF: (type: string, params?: Record<string, string>) =>
    api.get(`/reports/export/pdf/${type}`, { params, responseType: 'blob' }),

  exportExcel: (type: string, params?: Record<string, string>) =>
    api.get(`/reports/export/excel/${type}`, { params, responseType: 'blob' }),
}

export default api
