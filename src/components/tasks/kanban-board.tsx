'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { createClient } from '@/lib/supabase/client'
import { TASK_STATUSES, type TaskStatus } from '@/lib/constants'
import { useRealtime } from '@/hooks/use-realtime'
import { useCelebration } from '@/hooks/use-celebration'
import { useToast } from '@/components/ui/toast'
import { KanbanColumn } from './kanban-column'
import { TaskForm, type TaskFormData } from './task-form'
import { TaskDetail } from './task-detail'
import { TaskFilters } from './task-filters'
import { Button } from '@/components/ui/button'
import { TaskCardSkeleton } from '@/components/ui/skeleton'
import type { TaskWithProfiles, Profile, Task } from '@/types/database'

export function KanbanBoard() {
  const [tasks, setTasks] = useState<TaskWithProfiles[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTask, setActiveTask] = useState<TaskWithProfiles | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState<TaskWithProfiles | null>(null)
  const [detailTask, setDetailTask] = useState<TaskWithProfiles | null>(null)
  const [filterPriority, setFilterPriority] = useState('')
  const [filterAssignee, setFilterAssignee] = useState('')
  const { celebrate } = useCelebration()
  const { toast } = useToast()
  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Fetch tasks and profiles
  const fetchData = useCallback(async () => {
    const [tasksRes, profilesRes] = await Promise.all([
      supabase
        .from('tasks')
        .select('*, assignee:profiles!tasks_assignee_id_fkey(*), creator:profiles!tasks_creator_id_fkey(*)')
        .order('position', { ascending: true }),
      supabase.from('profiles').select('*').order('full_name'),
    ])

    if (tasksRes.data) setTasks(tasksRes.data as TaskWithProfiles[])
    if (profilesRes.data) setProfiles(profilesRes.data)
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  // Realtime updates
  useRealtime<Task>({
    table: 'tasks',
    onInsert: () => fetchData(),
    onUpdate: () => fetchData(),
    onDelete: () => fetchData(),
  })

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterPriority && t.priority !== filterPriority) return false
    if (filterAssignee && t.assignee_id !== filterAssignee) return false
    return true
  })

  const getColumnTasks = (status: TaskStatus) =>
    filteredTasks.filter((t) => t.status === status)

  // Drag handlers
  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    // Determine target status: over could be a column or another task
    let targetStatus: TaskStatus
    const overTask = tasks.find((t) => t.id === over.id)
    if (overTask) {
      targetStatus = overTask.status
    } else if (TASK_STATUSES.includes(over.id as TaskStatus)) {
      targetStatus = over.id as TaskStatus
    } else {
      return
    }

    if (task.status === targetStatus) return

    const wasNotDone = task.status !== 'done'
    const isNowDone = targetStatus === 'done'

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    )

    // API call
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: targetStatus }),
    })

    if (!res.ok) {
      // Revert
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t))
      )
      toast('Failed to update task status', 'error')
      return
    }

    // Celebration when moving to done
    if (wasNotDone && isNowDone) {
      celebrate()
      toast(`"${task.title}" marked as complete`, 'success')
    } else {
      const statusLabel = targetStatus === 'todo' ? 'To Do' : targetStatus === 'in_progress' ? 'In Progress' : 'Done'
      toast(`Task moved to ${statusLabel}`, 'info')
    }
  }

  // Create/update task
  async function handleTaskSubmit(data: TaskFormData) {
    const url = editTask ? `/api/tasks/${editTask.id}` : '/api/tasks'
    const method = editTask ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        assignee_id: data.assignee_id || null,
        due_date: data.due_date || null,
      }),
    })

    if (res.ok) {
      toast(editTask ? 'Task updated' : 'Task created', 'success')
      fetchData()
      setEditTask(null)
    } else {
      const err = await res.json().catch(() => ({}))
      console.error('Task submit error:', res.status, err)
      toast(err.error || 'Something went wrong', 'error')
    }
  }

  // Delete task
  async function handleDeleteTask(taskId: string) {
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
    if (res.ok) {
      toast('Task deleted', 'info')
      setDetailTask(null)
      fetchData()
    } else {
      toast('Failed to delete task', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4">
        {TASK_STATUSES.map((s) => (
          <div key={s} className="min-w-[320px] flex-1 space-y-3">
            <div className="h-12 bg-neutral-200 rounded-t-lg animate-pulse" />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tasks.length} total tasks {'\u00B7'} Drag to update status
          </p>
        </div>
        <Button onClick={() => { setEditTask(null); setShowForm(true) }}>
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TaskFilters
          priority={filterPriority}
          assignee={filterAssignee}
          onPriorityChange={setFilterPriority}
          onAssigneeChange={setFilterAssignee}
          profiles={profiles}
        />
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4">
          {TASK_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={getColumnTasks(status)}
              onTaskClick={(task) => setDetailTask(task)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="bg-white rounded-lg border-2 border-indigo-400 shadow-lg p-4 w-[320px] rotate-1 opacity-90">
              <p className="font-medium text-sm text-gray-900">{activeTask.title}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Task form modal */}
      <TaskForm
        open={showForm || !!editTask}
        onClose={() => { setShowForm(false); setEditTask(null) }}
        onSubmit={handleTaskSubmit}
        task={editTask}
        profiles={profiles}
      />

      {/* Task detail modal */}
      {detailTask && (
        <TaskDetail
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onEdit={() => {
            setEditTask(detailTask)
            setDetailTask(null)
          }}
          onDelete={() => handleDeleteTask(detailTask.id)}
          profiles={profiles}
        />
      )}
    </div>
  )
}
