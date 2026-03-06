'use client'

import { Card, CardContent } from '@/components/ui/card'
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
    { label: 'Total Tasks', value: total, emoji: '\u{1F4CA}', color: 'bg-indigo-50 text-indigo-700' },
    { label: 'To Do', value: todo, emoji: '\u{1F4CB}', color: 'bg-slate-50 text-slate-700' },
    { label: 'In Progress', value: inProgress, emoji: '\u{1F525}', color: 'bg-blue-50 text-blue-700' },
    { label: 'Done', value: done, emoji: '\u2705', color: 'bg-green-50 text-green-700' },
    { label: 'High Priority', value: highPriority, emoji: '\u{1F534}', color: 'bg-red-50 text-red-700' },
    { label: 'Overdue', value: overdue, emoji: '\u{1F6A8}', color: 'bg-orange-50 text-orange-700' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="text-center py-4">
            <span className="text-2xl">{stat.emoji}</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
