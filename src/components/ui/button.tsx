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
          'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed tracking-[-0.01em]',
          variant === 'primary' && 'bg-[#6C3FEE] text-white hover:bg-[#5B35CC] hover:scale-[1.02] focus-visible:ring-[#6C3FEE]/50 shadow-sm',
          variant === 'secondary' && 'bg-white text-[#4A4039] border border-[#E8E0D8] hover:bg-[#FAF9F7] hover:border-[#D5CEC6] focus-visible:ring-[#6C3FEE]/30 shadow-sm',
          variant === 'ghost' && 'text-[#4A4039] hover:bg-[#F0EBE4] hover:text-[#2D2A26] focus-visible:ring-[#6C3FEE]/30',
          variant === 'danger' && 'bg-[#E5484D] text-white hover:bg-[#D13438] hover:scale-[1.02] focus-visible:ring-[#E5484D]/50 shadow-sm',
          size === 'sm' && 'text-[13px] px-3.5 py-1.5',
          size === 'md' && 'text-[13px] px-5 py-2.5',
          size === 'lg' && 'text-[14px] px-7 py-3',
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
