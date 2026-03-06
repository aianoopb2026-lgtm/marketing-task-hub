import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-[13px] font-medium text-neutral-700 tracking-[-0.01em]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'block w-full rounded-lg border px-3.5 py-2.5 text-[14px] transition-colors',
            'placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-neutral-200 focus:border-neutral-400 focus:ring-neutral-100',
            className
          )}
          {...props}
        />
        {error && <p className="text-[13px] text-red-600">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
