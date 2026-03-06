'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { STATUS_CONFIG } from '@/lib/constants'
import type { TaskStatus } from '@/lib/constants'
import type { TaskWithProfiles } from '@/types/database'
import { TaskCard } from './task-card'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  status: TaskStatus
  tasks: TaskWithProfiles[]
  onTaskClick: (task: TaskWithProfiles) => void
}

export function KanbanColumn({ status, tasks, onTaskClick }: KanbanColumnProps) {
  const config = STATUS_CONFIG[status]
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col min-w-[320px] max-w-[380px] flex-1">
      {/* Column header */}
      <div className={cn('rounded-t-xl px-4 py-3 border border-b-0', config.borderClass, config.bgClass)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn('w-2.5 h-2.5 rounded-full', config.dotColor)} />
            <h3 className={cn('font-semibold text-sm', config.textClass)}>
              {config.emoji} {config.label}
            </h3>
          </div>
          <span className={cn(
            'text-xs font-bold px-2 py-0.5 rounded-full',
            config.bgClass, config.textClass
          )}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 rounded-b-xl border p-3 space-y-3 min-h-[200px] transition-colors duration-200',
          config.borderClass,
          isOver ? 'bg-indigo-50/50 border-indigo-300' : 'bg-gray-50/50'
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-1">
                {status === 'todo' ? '\u{1F4DD}' : status === 'in_progress' ? '\u{1F3C3}' : '\u{1F3C6}'}
              </div>
              <p>No tasks here</p>
              <p className="text-xs">Drag tasks here or create new ones</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
