// ============================================================
// VOLUNTEERHUB — TYPE DEFINITIONS
// ============================================================

export type UserRole = 'admin' | 'leader' | 'volunteer'
export type ScheduleStatus = 'pending' | 'confirmed' | 'absent' | 'swap_requested'
export type SwapStatus = 'pending' | 'accepted' | 'rejected' | 'leader_approved'
export type EventType = 'regular' | 'special' | 'training' | 'conference'
export type ContentType = 'audio' | 'youtube' | 'chord' | 'pdf' | 'image'
export type NotificationType = 'schedule' | 'swap' | 'reminder' | 'feedback' | 'system'

// ── Church ─────────────────────────────────────────────────
export interface Church {
  id: string
  name: string
  pastor?: string
  city?: string
  website?: string
  logo_url?: string
  created_at: string
}

// ── User / Volunteer ───────────────────────────────────────
export interface User {
  id: string
  church_id: string
  name: string
  email: string
  whatsapp?: string
  profession?: string
  skills: string[]
  role: UserRole
  avatar_url?: string
  points: number
  is_active: boolean
  unavailable_days: number[]   // 0=Dom … 6=Sáb
  created_at: string
  // Relations
  ministries?: MinistryMember[]
  presence_rate?: number
  rank?: number
}

export interface CreateUserDto {
  name: string
  email: string
  whatsapp?: string
  profession?: string
  skills?: string[]
  role?: UserRole
  unavailable_days?: number[]
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  is_active?: boolean
}

// ── Ministry ───────────────────────────────────────────────
export interface Ministry {
  id: string
  church_id: string
  name: string
  icon?: string
  color: string
  leader_id?: string
  description?: string
  functions: string[]
  created_at: string
  // Relations
  leader?: User
  members?: MinistryMember[]
  member_count?: number
  presence_rate?: number
}

export interface MinistryMember {
  id: string
  ministry_id: string
  user_id: string
  role: string
  priority: number
  joined_at: string
  // Relations
  user?: User
  ministry?: Ministry
}

export interface CreateMinistryDto {
  name: string
  icon?: string
  color?: string
  leader_id?: string
  description?: string
  functions?: string[]
}

// ── Event ──────────────────────────────────────────────────
export interface Event {
  id: string
  church_id: string
  title: string
  description?: string
  type: EventType
  event_date: string
  end_time?: string
  dress_code?: string
  dress_colors: string[]
  created_by: string
  created_at: string
  // Relations
  content?: EventContent[]
  schedules?: Schedule[]
  volunteer_count?: number
}

export interface EventContent {
  id: string
  event_id: string
  type: ContentType
  title?: string
  url?: string
  content?: string   // cifra raw
  tone?: string      // tom original
  created_at: string
}

export interface CreateEventDto {
  title: string
  description?: string
  type?: EventType
  event_date: string
  end_time?: string
  dress_code?: string
  dress_colors?: string[]
}

// ── Schedule ───────────────────────────────────────────────
export interface Schedule {
  id: string
  event_id: string
  volunteer_id: string
  ministry_id: string
  role: string
  status: ScheduleStatus
  checked_in_at?: string
  notes?: string
  created_at: string
  // Relations
  event?: Event
  volunteer?: User
  ministry?: Ministry
}

export interface CreateScheduleDto {
  event_id: string
  volunteer_id: string
  ministry_id: string
  role: string
  notes?: string
}

export interface AIScheduleSuggestion {
  volunteer: User
  ministry: Ministry
  role: string
  score: number
  reason: string
}

// ── Schedule Swap ──────────────────────────────────────────
export interface ScheduleSwap {
  id: string
  schedule_id: string
  requester_id: string
  substitute_id?: string
  status: SwapStatus
  reason?: string
  created_at: string
  // Relations
  schedule?: Schedule
  requester?: User
  substitute?: User
}

// ── Attendance ─────────────────────────────────────────────
export interface Attendance {
  id: string
  schedule_id: string
  user_id: string
  event_id: string
  present: boolean
  on_time?: boolean
  points_earned: number
  recorded_at: string
}

// ── Feedback ───────────────────────────────────────────────
export interface Feedback {
  id: string
  from_user_id: string
  to_user_id: string
  event_id?: string
  rating: 1 | 2 | 3 | 4 | 5
  comment?: string
  created_at: string
  // Relations
  from_user?: User
  to_user?: User
  event?: Event
}

export interface CreateFeedbackDto {
  to_user_id: string
  event_id?: string
  rating: 1 | 2 | 3 | 4 | 5
  comment?: string
}

// ── Notification ───────────────────────────────────────────
export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  data?: Record<string, unknown>
  created_at: string
}

// ── Reports ────────────────────────────────────────────────
export interface PresenceReport {
  user_id: string
  user_name: string
  ministry_name: string
  total_events: number
  attended: number
  absent: number
  presence_rate: number
  points: number
  rank: number
}

export interface MinistryReport {
  ministry_id: string
  ministry_name: string
  total_schedules: number
  confirmed: number
  absent: number
  swap_requests: number
  presence_rate: number
}

export interface MonthlyStats {
  month: string
  total_volunteers: number
  active_volunteers: number
  total_events: number
  average_presence: number
  points_distributed: number
}

// ── Auth ───────────────────────────────────────────────────
export interface AuthTokens {
  access_token: string
  refresh_token?: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
  church_name?: string
}

// ── API Response ───────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiError {
  statusCode: number
  message: string | string[]
  error: string
}

// ── UI / Component Props ───────────────────────────────────
export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'gray'
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'success' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface TableColumn<T> {
  key: keyof T | string
  header: string
  render?: (value: unknown, row: T) => React.ReactNode
  width?: string
  sortable?: boolean
}

// ── Store ──────────────────────────────────────────────────
export interface AppStore {
  user: User | null
  church: Church | null
  notifications: Notification[]
  unreadCount: number
  sidebarOpen: boolean
  setUser: (user: User | null) => void
  setChurch: (church: Church | null) => void
  setNotifications: (n: Notification[]) => void
  setSidebarOpen: (open: boolean) => void
  markNotificationRead: (id: string) => void
}
