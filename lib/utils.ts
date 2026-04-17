import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Tailwind class merger
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

// Date formatters
export const formatDate = (date: string | Date, pattern = 'dd MMM yyyy') =>
  format(new Date(date), pattern, { locale: ptBR })

export const formatDateTime = (date: string | Date) =>
  format(new Date(date), "dd MMM 'às' HH:mm", { locale: ptBR })

export const formatRelative = (date: string | Date) =>
  formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR })

export const formatDayLabel = (date: string | Date) => {
  const d = new Date(date)
  if (isToday(d)) return 'Hoje'
  if (isTomorrow(d)) return 'Amanhã'
  return format(d, "EEE, dd 'de' MMM", { locale: ptBR })
}

// Avatar initials
export const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

// Avatar color from string (deterministic)
const AVATAR_COLORS = [
  '#7C3AED', '#2563EB', '#0891B2', '#16A34A',
  '#F59E0B', '#DC2626', '#DB2777', '#0D9488',
]
export const getAvatarColor = (str: string) => {
  let hash = 0
  for (const ch of str) hash = ch.charCodeAt(0) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// Presence rate color
export const getPresenceColor = (rate: number) => {
  if (rate >= 90) return '#16A34A'
  if (rate >= 75) return '#F59E0B'
  return '#DC2626'
}

// Points tier
export const getPointsTier = (points: number) => {
  if (points >= 1500) return { label: 'Diamante', color: '#06B6D4', icon: '💎' }
  if (points >= 1000) return { label: 'Ouro',     color: '#F59E0B', icon: '🥇' }
  if (points >= 500)  return { label: 'Prata',    color: '#94A3B8', icon: '🥈' }
  return                     { label: 'Bronze',   color: '#CD7F32', icon: '🥉' }
}

// Day of week label
export const DAY_LABELS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

// Currency / number formatting
export const formatNumber = (n: number) =>
  new Intl.NumberFormat('pt-BR').format(n)

// Download blob
export const downloadBlob = (blob: Blob, filename: string) => {
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// Chord transposition
const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const ENHARMONIC: Record<string, string> = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' }

const normalizeNote = (note: string) => ENHARMONIC[note] || note

const transposeNote = (note: string, semitones: number) => {
  const norm = normalizeNote(note)
  const idx  = CHROMATIC.indexOf(norm)
  if (idx === -1) return note
  return CHROMATIC[(idx + semitones + 12) % 12]
}

export const transposeChord = (chord: string, semitones: number): string => {
  return chord.replace(/[A-G][#b]?/g, (note) => transposeNote(note, semitones))
}

export const transposeChordSheet = (sheet: string, from: string, to: string): string => {
  const fromIdx = CHROMATIC.indexOf(normalizeNote(from))
  const toIdx   = CHROMATIC.indexOf(normalizeNote(to))
  if (fromIdx === -1 || toIdx === -1) return sheet
  const semitones = (toIdx - fromIdx + 12) % 12
  // Replace chords (lines starting with capital letter chord patterns)
  return sheet.split('\n').map(line => {
    const isChordLine = /^[A-G][#b]?m?[\d/a-zA-Z]*(\s+[A-G][#b]?m?[\d/a-zA-Z]*)*\s*$/.test(line.trim())
    if (!isChordLine) return line
    return line.replace(/[A-G][#b]?/g, (note) => transposeNote(note, semitones))
  }).join('\n')
}

export const NOTES = CHROMATIC

// Schedule status utils
export const scheduleStatusLabel: Record<string, string> = {
  pending:        'Pendente',
  confirmed:      'Confirmado',
  absent:         'Ausente',
  swap_requested: 'Troca Solicitada',
}

export const scheduleStatusVariant: Record<string, string> = {
  pending:        'warning',
  confirmed:      'success',
  absent:         'danger',
  swap_requested: 'purple',
}

// Role labels
export const roleLabel: Record<string, string> = {
  admin:     'Administrador',
  leader:    'Líder',
  volunteer: 'Voluntário',
}

// Truncate
export const truncate = (str: string, max = 40) =>
  str.length > max ? str.slice(0, max) + '…' : str
