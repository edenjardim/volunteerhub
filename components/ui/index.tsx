'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Check, ChevronDown, Search, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────────────────
interface AvatarProps {
  name: string
  src?: string | null
  size?: number
  color?: string
  className?: string
}
export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 36, color = '#2563EB', className }) => {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
  return (
    <div
      className={cn('rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden', className)}
      style={{ width: size, height: size, background: src ? 'transparent' : color, fontSize: size * 0.35 }}
    >
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : initials}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────────────────
type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'gray'
const badgeVariants: Record<BadgeVariant, string> = {
  success: 'bg-[#F0FDF4] text-[#16A34A]',
  warning: 'bg-[#FFFBEB] text-[#B45309]',
  danger:  'bg-[#FEF2F2] text-[#DC2626]',
  info:    'bg-[#EFF6FF] text-[#1D4ED8]',
  purple:  'bg-[#F5F3FF] text-[#6D28D9]',
  gray:    'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]',
}
export const Badge: React.FC<{ children: React.ReactNode; variant?: BadgeVariant; className?: string }> = ({
  children, variant = 'info', className,
}) => (
  <span className={cn('badge', badgeVariants[variant], className)}>{children}</span>
)

// ─────────────────────────────────────────────────────────
// BUTTON
// ─────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'success' | 'ghost'
type ButtonSize    = 'sm' | 'md' | 'lg'
const btnVariants: Record<ButtonVariant, string> = {
  primary:   'bg-secondary text-white shadow-sm hover:bg-blue-600',
  secondary: 'bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0] hover:bg-[#E2E8F0]',
  accent:    'bg-accent text-white shadow-sm hover:bg-purple-700',
  danger:    'bg-[#FEF2F2] text-danger border border-[#FECACA] hover:bg-[#FEE2E2]',
  success:   'bg-[#F0FDF4] text-success border border-[#BBF7D0] hover:bg-[#DCFCE7]',
  ghost:     'bg-transparent text-muted border border-[#E2E8F0] hover:bg-[#F8FAFC]',
}
const btnSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
}
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant; size?: ButtonSize; loading?: boolean
}>(({ children, variant = 'primary', size = 'md', loading, className, disabled, ...props }, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={cn('btn', btnVariants[variant], btnSizes[size], 'hover:-translate-y-px active:translate-y-0', className)}
    {...props}
  >
    {loading ? (
      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    ) : children}
  </button>
))
Button.displayName = 'Button'

// ─────────────────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────────────────
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string; error?: string; hint?: string; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode
}>(({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="block text-sm font-semibold text-[#374151] mb-1.5">{label}</label>}
      <div className="relative">
        {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{leftIcon}</div>}
        <input
          ref={ref}
          id={inputId}
          className={cn('input', leftIcon && 'pl-9', rightIcon && 'pr-9', error && 'border-danger focus:ring-red-100', className)}
          {...props}
        />
        {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">{rightIcon}</div>}
      </div>
      {error && <p className="text-xs text-danger mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
      {hint && !error && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  )
})
Input.displayName = 'Input'

// ─────────────────────────────────────────────────────────
// TEXTAREA
// ─────────────────────────────────────────────────────────
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string; error?: string
}>(({ label, error, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-semibold text-[#374151] mb-1.5">{label}</label>}
    <textarea ref={ref} className={cn('input resize-none', error && 'border-danger', className)} {...props} />
    {error && <p className="text-xs text-danger mt-1">{error}</p>}
  </div>
))
Textarea.displayName = 'Textarea'

// ─────────────────────────────────────────────────────────
// SELECT
// ─────────────────────────────────────────────────────────
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string; error?: string; options: { value: string; label: string }[]
}>(({ label, error, options, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-semibold text-[#374151] mb-1.5">{label}</label>}
    <div className="relative">
      <select ref={ref} className={cn('input appearance-none pr-9', error && 'border-danger', className)} {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
    </div>
    {error && <p className="text-xs text-danger mt-1">{error}</p>}
  </div>
))
Select.displayName = 'Select'

// ─────────────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────────────
const modalSizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
export const Modal: React.FC<{
  open: boolean; onClose: () => void; title: string
  children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'
  footer?: React.ReactNode
}> = ({ open, onClose, title, children, size = 'md', footer }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#020617]/60 backdrop-blur-sm" />
      <div
        className={cn('relative bg-white w-full sm:rounded-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-modal animate-slide-up', modalSizes[size])}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#F1F5F9] flex-shrink-0">
          <h3 className="text-base font-bold text-[#020617] leading-tight">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-muted hover:text-[#020617] hover:bg-[#F1F5F9] transition-colors">
            <X size={15} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="px-5 sm:px-6 py-4 border-t border-[#F1F5F9] flex-shrink-0">{footer}</div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CARD
// ─────────────────────────────────────────────────────────
export const Card: React.FC<{
  children: React.ReactNode; className?: string
  onClick?: () => void; hover?: boolean; padding?: string
}> = ({ children, className, onClick, hover = !!onClick, padding = 'p-5' }) => (
  <div
    onClick={onClick}
    className={cn(
      'card', padding,
      hover && 'card-hover',
      onClick && 'cursor-pointer',
      className,
    )}
  >
    {children}
  </div>
)

// ─────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────
export const StatCard: React.FC<{
  value: string | number; label: string; icon: React.ElementType
  change?: string; changePositive?: boolean; color?: string; bg?: string
}> = ({ value, label, icon: Icon, change, changePositive, color = '#2563EB', bg = '#EFF6FF' }) => (
  <Card>
    <div className="flex items-start justify-between">
      <div>
        <div className="stat-value">{value}</div>
        <div className="text-sm text-muted mt-1">{label}</div>
        {change && (
          <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-semibold', changePositive ? 'text-success' : 'text-danger')}>
            {changePositive ? '↑' : '↓'} {change}
          </div>
        )}
      </div>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
        <Icon size={20} color={color} />
      </div>
    </div>
  </Card>
)

// ─────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────
export const ProgressBar: React.FC<{ value: number; color?: string; height?: number; label?: string; showValue?: boolean }> = ({
  value, color = '#2563EB', height = 6, label, showValue = false,
}) => (
  <div className="w-full">
    {(label || showValue) && (
      <div className="flex justify-between items-center mb-1.5">
        {label    && <span className="text-xs text-muted">{label}</span>}
        {showValue && <span className="text-xs font-bold" style={{ color }}>{value}%</span>}
      </div>
    )}
    <div className="rounded-full overflow-hidden bg-[#F1F5F9]" style={{ height }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, value)}%`, background: color }} />
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────
// TOGGLE
// ─────────────────────────────────────────────────────────
export const Toggle: React.FC<{
  value: boolean; onChange: (v: boolean) => void
  label: string; description?: string; disabled?: boolean
}> = ({ value, onChange, label, description, disabled = false }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-[#F8FAFC] last:border-0">
    <div className="flex-1 pr-4">
      <div className="text-sm font-semibold text-[#334155]">{label}</div>
      {description && <div className="text-xs text-muted mt-0.5 leading-relaxed">{description}</div>}
    </div>
    <button
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-40"
      style={{ background: value ? '#2563EB' : '#E2E8F0' }}
      role="switch"
      aria-checked={value}
    >
      <div className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200', value ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  </div>
)

// ─────────────────────────────────────────────────────────
// ALERT
// ─────────────────────────────────────────────────────────
const alertStyles = {
  info:    { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8', Icon: Info },
  success: { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A', Icon: CheckCircle },
  warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309', Icon: AlertCircle },
  danger:  { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', Icon: XCircle },
}
export const Alert: React.FC<{ type?: keyof typeof alertStyles; title?: string; children: React.ReactNode }> = ({
  type = 'info', title, children,
}) => {
  const { bg, border, text, Icon } = alertStyles[type]
  return (
    <div className="flex gap-3 p-4 rounded-xl border" style={{ background: bg, borderColor: border }}>
      <Icon size={18} color={text} className="flex-shrink-0 mt-0.5" />
      <div>
        {title && <div className="text-sm font-bold mb-0.5" style={{ color: text }}>{title}</div>}
        <div className="text-sm leading-relaxed" style={{ color: text }}>{children}</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────
export const EmptyState: React.FC<{ icon?: string; title: string; description?: string; action?: React.ReactNode }> = ({
  icon = '📭', title, description, action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <div className="text-base font-bold text-[#020617] mb-1">{title}</div>
    {description && <div className="text-sm text-muted max-w-xs leading-relaxed mb-4">{description}</div>}
    {action}
  </div>
)

// ─────────────────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────────────────
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-[#F1F5F9] rounded-lg animate-pulse', className)} />
)

export const SkeletonCard: React.FC = () => (
  <Card>
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-3 w-full mb-2" />
    <Skeleton className="h-3 w-4/5 mb-2" />
    <Skeleton className="h-3 w-2/3" />
  </Card>
)

// ─────────────────────────────────────────────────────────
// CONFIRM DIALOG
// ─────────────────────────────────────────────────────────
export const ConfirmDialog: React.FC<{
  open: boolean; title: string; message: string
  onConfirm: () => void; onCancel: () => void
  confirmLabel?: string; variant?: 'danger' | 'primary'
}> = ({ open, title, message, onConfirm, onCancel, confirmLabel = 'Confirmar', variant = 'danger' }) => (
  <Modal open={open} onClose={onCancel} title={title} size="sm">
    <p className="text-sm text-muted leading-relaxed mb-5">{message}</p>
    <div className="flex gap-2.5 justify-end">
      <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
      <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
    </div>
  </Modal>
)

// ─────────────────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────────────────
export const Tabs: React.FC<{
  tabs: { key: string; label: string; icon?: string }[]
  active: string; onChange: (key: string) => void
  variant?: 'pill' | 'underline'
}> = ({ tabs, active, onChange, variant = 'pill' }) => (
  <div className={cn(
    'flex',
    variant === 'pill' && 'gap-1 p-1 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]',
    variant === 'underline' && 'border-b border-[#E2E8F0] gap-0',
  )}>
    {tabs.map(t => (
      <button
        key={t.key}
        onClick={() => onChange(t.key)}
        className={cn(
          'text-xs font-semibold transition-all',
          variant === 'pill' && 'flex-1 py-2 rounded-lg',
          variant === 'pill' && (active === t.key ? 'bg-white shadow-sm text-[#020617]' : 'text-muted hover:text-[#020617]'),
          variant === 'underline' && 'px-4 py-2.5 border-b-2 -mb-px',
          variant === 'underline' && (active === t.key ? 'border-secondary text-secondary' : 'border-transparent text-muted hover:text-[#020617]'),
        )}
      >
        {t.icon && <span className="mr-1.5">{t.icon}</span>}
        {t.label}
      </button>
    ))}
  </div>
)

// ─────────────────────────────────────────────────────────
// TABLE
// ─────────────────────────────────────────────────────────
export function Table<T extends Record<string, unknown>>({
  columns, data, onRowClick, emptyMessage = 'Nenhum registro encontrado',
}: {
  columns: { key: string; header: string; render?: (val: unknown, row: T) => React.ReactNode; width?: string }[]
  data: T[]; onRowClick?: (row: T) => void; emptyMessage?: string
}) {
  if (!data.length) return (
    <EmptyState icon="📋" title={emptyMessage} />
  )
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#F1F5F9] bg-[#FAFAFA]">
            {columns.map(c => (
              <th key={c.key} style={{ width: c.width }} className="text-left text-[11px] font-bold text-muted uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={cn('border-b border-[#F8FAFC] transition-colors', onRowClick && 'hover:bg-[#FAFAFA] cursor-pointer')}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(c => (
                <td key={c.key} className="px-4 py-3.5 text-sm text-[#334155]">
                  {c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SEARCH INPUT
// ─────────────────────────────────────────────────────────
export const SearchInput: React.FC<{
  value: string; onChange: (v: string) => void
  placeholder?: string; className?: string
}> = ({ value, onChange, placeholder = 'Buscar...', className }) => (
  <div className={cn('relative', className)}>
    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
    <input
      className="input pl-9"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
    {value && (
      <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#020617]">
        <X size={14} />
      </button>
    )}
  </div>
)

// ─────────────────────────────────────────────────────────
// PAGE HEADER
// ─────────────────────────────────────────────────────────
export const PageHeader: React.FC<{ title: string; subtitle?: string; actions?: React.ReactNode }> = ({
  title, subtitle, actions,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex gap-2.5 flex-wrap">{actions}</div>}
  </div>
)
