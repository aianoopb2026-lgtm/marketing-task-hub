import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed tracking-[-0.01em]',
          variant === 'primary' && 'bg-[#09090b] text-white hover:bg-[#18181b] focus-visible:ring-neutral-600 shadow-sm',
          variant === 'secondary' && 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 focus-visible:ring-neutral-400 shadow-sm',
          variant === 'ghost' && 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-400',
          variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm',
          size === 'sm' && 'text-[13px] px-3 py-1.5',
          size === 'md' && 'text-[13px] px-4 py-2.5',
          size === 'lg' && 'text-[14px] px-6 py-3',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
