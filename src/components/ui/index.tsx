import { cn } from '@/utils'

// Re-export named components from separate files
export { Button } from './Button'
export { Input } from './Input'

// ==================== BADGE ====================
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'new' | 'sale'

const badgeStyles: Record<BadgeVariant, string> = {
  default:  'bg-gray-100 text-gray-700',
  success:  'bg-green-100 text-green-700',
  warning:  'bg-yellow-100 text-yellow-700',
  danger:   'bg-red-100 text-red-700',
  info:     'bg-blue-100 text-blue-700',
  new:      'bg-primary-100 text-primary-700',
  sale:     'bg-red-500 text-white',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      badgeStyles[variant],
      className
    )}
  >
    {children}
  </span>
)

// ==================== SPINNER ====================
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const spinnerSizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }

export const Spinner = ({ size = 'md', className }: SpinnerProps) => (
  <div
    className={cn(
      'animate-spin rounded-full border-2 border-gray-200 border-t-primary-600',
      spinnerSizes[size],
      className
    )}
  />
)

// ==================== SKELETON ====================
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-md bg-gray-200', className)} />
)

// ==================== EMPTY STATE ====================
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    {icon && (
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        {icon}
      </div>
    )}
    <h3 className="text-base font-semibold text-gray-800">{title}</h3>
    {description && <p className="max-w-xs text-sm text-gray-500">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
)

// ==================== DIVIDER ====================
export const Divider = ({ label }: { label?: string }) =>
  label ? (
    <div className="flex items-center gap-3">
      <div className="flex-1 border-t border-gray-200" />
      <span className="text-xs text-gray-400">{label}</span>
      <div className="flex-1 border-t border-gray-200" />
    </div>
  ) : (
    <hr className="border-t border-gray-200" />
  )
