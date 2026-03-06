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
    { label: 'Total Tasks', value: total, dotColor: 'bg-indigo-500', color: 'bg-indigo-50 text-indigo-700' },
    { label: 'To Do', value: todo, dotColor: 'bg-neutral-500', color: 'bg-slate-50 text-slate-700' },
    { label: 'In Progress', value: inProgress, dotColor: 'bg-blue-500', color: 'bg-blue-50 text-blue-700' },
    { label: 'Done', value: done, dotColor: 'bg-green-500', color: 'bg-green-50 text-green-700' },
    { label: 'High Priority', value: highPriority, dotColor: 'bg-red-500', color: 'bg-red-50 text-red-700' },
    { label: 'Overdue', value: overdue, dotColor: 'bg-orange-500', color: 'bg-orange-50 text-orange-700' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="text-center py-4">
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className={cn('w-2 h-2 rounded-full', stat.dotColor)} />
              <p className="text-xs text-neutral-500 font-medium">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
