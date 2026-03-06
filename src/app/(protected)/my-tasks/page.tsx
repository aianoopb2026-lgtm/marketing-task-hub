'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'
import { useCelebration } from '@/hooks/use-celebration'
import { useToast } from '@/components/ui/toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PriorityBadge } from '@/components/ui/badge'
import { TeamAvatar } from '@/components/ui/avatar'
import { STATUS_CONFIG } from '@/lib/constants'
import { formatDate, isOverdue, cn } from '@/lib/utils'
import type { TaskWithProfiles } from '@/types/database'

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<TaskWithProfiles[]>([])
  const [loading, setLoading] = useState(true)
  const { profile } = useUser()
  const { celebrate } = useCelebration()
  const { toast } = useToast()
  const supabase = createClient()

  const fetchTasks = useCallback(async () => {
    if (!profile) return
    const { data } = await supabase
      .from('tasks')
      .select('*, assignee:profiles!tasks_assignee_id_fkey(*), creator:profiles!tasks_creator_id_fkey(*)')
      .or(`assignee_id.eq.${profile.id},creator_id.eq.${profile.id}`)
      .order('created_at', { ascending: false })

    if (data) setTasks(data as TaskWithProfiles[])
    setLoading(false)
  }, [profile, supabase])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  async function updateStatus(taskId: string, newStatus: string, oldStatus: string) {
    const task = tasks.find((t) => t.id === taskId)
    // Optimistic
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus as TaskWithProfiles['status'] } : t))
    )

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })

    if (!res.ok) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: oldStatus as TaskWithProfiles['status'] } : t))
      )
      toast('Failed to update', 'error')
      return
    }

    if (newStatus === 'done' && oldStatus !== 'done') {
      celebrate()
      toast(`"${task?.title}" completed!`, 'success')
    }
  }

  const activeTasks = tasks.filter((t) => t.status !== 'done')
  const completedTasks = tasks.filter((t) => t.status === 'done')

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {profile?.emoji} My Tasks
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {activeTasks.length} active {'\u00B7'} {completedTasks.length} completed
        </p>
      </div>

      {/* Active Tasks */}
      <div className="space-y-3 mb-8">
        {activeTasks.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">All caught up -- no active tasks</p>
            </CardContent>
          </Card>
        )}

        {activeTasks.map((task) => {
          const statusConfig = STATUS_CONFIG[task.status]
          const overdue = isOverdue(task.due_date)
          return (
            <Card key={task.id} hover className="group">
              <CardContent className="flex items-center gap-4">
                {/* Status quick-toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const next = task.status === 'todo' ? 'in_progress' : 'done'
                    updateStatus(task.id, next, task.status)
                  }}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                    'hover:scale-110',
                    task.status === 'in_progress' ? 'border-blue-500 bg-blue-100' : 'border-gray-300 hover:border-green-400'
                  )}
                  title={task.status === 'todo' ? 'Start task' : 'Complete task'}
                >
                  {task.status === 'in_progress' && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{task.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', statusConfig.bgClass, statusConfig.textClass)}>
                      {statusConfig.label}
                    </span>
                    <PriorityBadge priority={task.priority} />
                    {task.due_date && (
                      <span className={cn('text-xs', overdue ? 'text-red-600 font-medium' : 'text-gray-500')}>
                        {formatDate(task.due_date)}
                      </span>
                    )}
                  </div>
                </div>

                {task.assignee && (
                  <TeamAvatar
                    emoji={task.assignee.emoji}
                    color={task.assignee.avatar_color}
                    size="sm"
                    name={task.assignee.full_name}
                  />
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Completed */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Completed ({completedTasks.length})</h2>
          <div className="space-y-2">
            {completedTasks.slice(0, 10).map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-500 line-through truncate">{task.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
