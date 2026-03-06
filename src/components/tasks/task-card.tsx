'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn, formatDate, isOverdue, isDueSoon } from '@/lib/utils'
import { PRIORITY_CONFIG } from '@/lib/constants'
import { TeamAvatar } from '@/components/ui/avatar'
import type { TaskWithProfiles } from '@/types/database'

interface TaskCardProps {
  task: TaskWithProfiles
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priorityConfig = PRIORITY_CONFIG[task.priority]
  const overdue = isOverdue(task.due_date) && task.status !== 'done'
  const dueSoon = isDueSoon(task.due_date) && task.status !== 'done'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'bg-white rounded-lg border p-4 cursor-grab active:cursor-grabbing transition-all duration-200',
        'hover:border-neutral-300 group',
        isDragging && 'opacity-50 shadow-xl rotate-2 scale-105',
        task.status === 'done' && 'opacity-75',
        overdue && 'border-red-300 bg-red-50/50',
      )}
    >
      {/* Priority badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
          priorityConfig.bgClass, priorityConfig.textClass
        )}>
          <span className={cn('w-1.5 h-1.5 rounded-full', priorityConfig.dotColor)} />
          {priorityConfig.label}
        </span>
      </div>

      {/* Title */}
      <h3 className={cn(
        'font-medium text-gray-900 text-sm mb-2 line-clamp-2',
        task.status === 'done' && 'line-through text-gray-500'
      )}>
        {task.title}
      </h3>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        {/* Assignee */}
        {task.assignee ? (
          <div className="flex items-center gap-1.5">
            <TeamAvatar
              emoji={task.assignee.emoji}
              color={task.assignee.avatar_color}
              size="sm"
              name={task.assignee.full_name}
            />
            <span className="text-xs text-gray-600 font-medium truncate max-w-[80px]">
              {task.assignee.full_name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic">Unassigned</span>
        )}

        {/* Due date */}
        {task.due_date && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            overdue && 'bg-red-100 text-red-700',
            dueSoon && !overdue && 'bg-yellow-100 text-yellow-700',
            !overdue && !dueSoon && 'bg-gray-100 text-gray-600',
          )}>
            {formatDate(task.due_date)}
          </span>
        )}
      </div>
    </div>
  )
}
