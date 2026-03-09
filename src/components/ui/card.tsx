import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-[#E8E0D8] shadow-[0_2px_8px_0_rgba(140,100,60,0.06)]',
        hover && 'hover:border-[#D5CEC6] hover:shadow-[0_4px_16px_0_rgba(140,100,60,0.1)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4 border-b border-[#E8E0D8]/60', className)}>{children}</div>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}
