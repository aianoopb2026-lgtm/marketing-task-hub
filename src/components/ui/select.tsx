import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, placeholder, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[#4A4039]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'block w-full rounded-xl border px-3 py-2 text-sm text-[#2D2A26] transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-[#E8E0D8] focus:border-[#6C3FEE] focus:ring-[#6C3FEE]/20',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
