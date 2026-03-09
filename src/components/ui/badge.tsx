import { cn } from '@/lib/utils'
import { PRIORITY_CONFIG } from '@/lib/constants'
import type { TaskPriority } from '@/lib/constants'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-[#F0EBE4] text-[#4A4039]',
        variant === 'outline' && 'border border-[#E8E0D8] text-[#4A4039]',
        className
      )}
    >
      {children}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = PRIORITY_CONFIG[priority]
  return (
    <Badge className={cn(config.bgClass, config.textClass, config.borderClass, 'border')}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
      {config.label}
    </Badge>
  )
}
