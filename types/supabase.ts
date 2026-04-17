// Auto-generated types from Supabase CLI
// Run: npx supabase gen types typescript --project-id [PROJECT_REF] > types/supabase.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      churches: {
        Row:    { id: string; name: string; pastor: string | null; city: string | null; website: string | null; logo_url: string | null; created_at: string }
        Insert: { id?: string; name: string; pastor?: string; city?: string; website?: string; logo_url?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['churches']['Insert']>
      }
      users: {
        Row:    { id: string; church_id: string | null; name: string; email: string; whatsapp: string | null; profession: string | null; skills: string[]; role: string; avatar_url: string | null; points: number; is_active: boolean; unavailable_days: number[]; callmebot_api_key: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; church_id?: string; name: string; email: string; whatsapp?: string; profession?: string; skills?: string[]; role?: string; avatar_url?: string; points?: number; is_active?: boolean; unavailable_days?: number[]; callmebot_api_key?: string }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      ministries: {
        Row:    { id: string; church_id: string; name: string; icon: string | null; color: string; leader_id: string | null; description: string | null; functions: string[]; created_at: string; updated_at: string }
        Insert: { id?: string; church_id: string; name: string; icon?: string; color?: string; leader_id?: string; description?: string; functions?: string[] }
        Update: Partial<Database['public']['Tables']['ministries']['Insert']>
      }
      events: {
        Row:    { id: string; church_id: string; title: string; description: string | null; type: string; event_date: string; end_time: string | null; dress_code: string | null; dress_colors: string[]; created_by: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; church_id: string; title: string; description?: string; type?: string; event_date: string; end_time?: string; dress_code?: string; dress_colors?: string[]; created_by?: string }
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
      schedules: {
        Row:    { id: string; event_id: string; volunteer_id: string; ministry_id: string; role: string; status: string; checked_in_at: string | null; notes: string | null; created_at: string }
        Insert: { id?: string; event_id: string; volunteer_id: string; ministry_id: string; role: string; status?: string; checked_in_at?: string; notes?: string }
        Update: Partial<Database['public']['Tables']['schedules']['Insert']>
      }
      notifications: {
        Row:    { id: string; user_id: string; type: string; title: string; message: string; read: boolean; data: Json | null; created_at: string }
        Insert: { id?: string; user_id: string; type: string; title: string; message: string; read?: boolean; data?: Json }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      attendance: {
        Row:    { id: string; schedule_id: string; user_id: string; event_id: string; present: boolean; on_time: boolean | null; points_earned: number; recorded_at: string }
        Insert: { id?: string; schedule_id: string; user_id: string; event_id: string; present: boolean; on_time?: boolean; points_earned?: number }
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>
      }
      feedbacks: {
        Row:    { id: string; from_user_id: string; to_user_id: string; event_id: string | null; rating: number; comment: string | null; created_at: string }
        Insert: { id?: string; from_user_id: string; to_user_id: string; event_id?: string; rating: number; comment?: string }
        Update: Partial<Database['public']['Tables']['feedbacks']['Insert']>
      }
    }
    Views:     Record<string, never>
    Functions: Record<string, never>
    Enums:     Record<string, never>
  }
}
