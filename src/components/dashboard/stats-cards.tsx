'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { TaskWithProfiles } from '@/types/database'

interface StatsCardsProps {
  tasks: TaskWithProfiles[]
}

export function StatsCards({ tasks }: StatsCardsProps) {
  const total = tasks.length
  const todo = tasks.filter((t) => t.status === 'todo').length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const done = tasks.filter((t) => t.status === 'done').length
  const highPriority = tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length
  const overdue = tasks.filter((t) => {
    if (!t.due_date || t.status === 'done') return false
    return new Date(t.due_date) < new Date()
  }).length

  const stats = [
    { label: 'Total Tasks', value: total, dotColor: 'bg-[#6C3FEE]', accent: 'border-l-[#6C3FEE]', valueColor: 'text-[#6C3FEE]' },
    { label: 'To Do', value: todo, dotColor: 'bg-[#38BDF8]', accent: 'border-l-[#38BDF8]', valueColor: 'text-[#38BDF8]' },
    { label: 'In Progress', value: inProgress, dotColor: 'bg-[#FF6B35]', accent: 'border-l-[#FF6B35]', valueColor: 'text-[#FF6B35]' },
    { label: 'Done', value: done, dotColor: 'bg-[#22C55E]', accent: 'border-l-[#22C55E]', valueColor: 'text-[#22C55E]' },
    { label: 'High Priority', value: highPriority, dotColor: 'bg-[#E5484D]', accent: 'border-l-[#E5484D]', valueColor: 'text-[#E5484D]' },
    { label: 'Overdue', value: overdue, dotColor: 'bg-[#FACC15]', accent: 'border-l-[#FACC15]', valueColor: 'text-[#FACC15]' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={cn('border-l-4', stat.accent)}>
          <CardContent className="text-center py-4">
            <p className={cn('text-3xl font-bold', stat.valueColor)}>{stat.value}</p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className={cn('w-2 h-2 rounded-full', stat.dotColor)} />
              <p className="text-xs text-[#9C8E7C] font-medium">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
