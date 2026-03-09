'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TeamAvatar } from '@/components/ui/avatar'
import { PriorityBadge } from '@/components/ui/badge'
import { formatDate, isOverdue, isDueSoon, cn } from '@/lib/utils'
import type { TaskWithProfiles } from '@/types/database'

interface UpcomingDeadlinesProps {
  tasks: TaskWithProfiles[]
}

export function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
  const tasksWithDueDate = tasks
    .filter((t) => t.due_date && t.status !== 'done')
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-[#2D2A26]">Upcoming Deadlines</h2>
      </CardHeader>
      <CardContent>
        {tasksWithDueDate.length === 0 ? (
          <div className="text-center py-8 text-[#9C8E7C]">
            <p className="text-sm">No upcoming deadlines</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasksWithDueDate.map((task) => {
              const overdue = isOverdue(task.due_date)
              const dueSoon = isDueSoon(task.due_date)

              return (
                <div
                  key={task.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                    overdue && 'border-red-200 bg-red-50/50',
                    dueSoon && !overdue && 'border-yellow-200 bg-yellow-50/50',
                    !overdue && !dueSoon && 'border-[#E8E0D8] bg-[#FAF9F7]/50',
                  )}
                >
                  {task.assignee ? (
                    <TeamAvatar
                      emoji={task.assignee.emoji}
                      color={task.assignee.avatar_color}
                      size="sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#E8E0D8] flex items-center justify-center text-xs text-[#9C8E7C]">?</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2D2A26] truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                  <span className={cn(
                    'text-xs font-medium whitespace-nowrap px-2 py-1 rounded-full',
                    overdue && 'bg-red-100 text-red-700',
                    dueSoon && !overdue && 'bg-yellow-100 text-yellow-700',
                    !overdue && !dueSoon && 'bg-[#F0EBE4] text-[#4A4039]',
                  )}>
                    {formatDate(task.due_date!)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
