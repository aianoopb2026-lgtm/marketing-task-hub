'use client'

import { cn } from '@/lib/utils'

interface TeamAvatarProps {
  emoji: string
  color: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  name?: string
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-lg',
  lg: 'w-12 h-12 text-xl',
  xl: 'w-16 h-16 text-3xl',
}

export function TeamAvatar({ emoji, color, size = 'md', name, className }: TeamAvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0 ring-1 ring-neutral-200',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: `${color}20`, borderColor: color }}
      title={name}
    >
      <span role="img" aria-label={name}>{emoji}</span>
    </div>
  )
}
