'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { TASK_STATUSES, TASK_PRIORITIES, STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/constants'
import type { TaskWithProfiles, Profile } from '@/types/database'

interface TaskFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => Promise<void>
  task?: TaskWithProfiles | null
  profiles: Profile[]
}

export interface TaskFormData {
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  assignee_id: string
}

export function TaskForm({ open, onClose, onSubmit, task, profiles }: TaskFormProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
    assignee_id: '',
  })

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date || '',
        assignee_id: task.assignee_id || '',
      })
    } else {
      setForm({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
        assignee_id: '',
      })
    }
  }, [task, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await onSubmit(form)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title={task ? '\u{270F}\uFE0F Edit Task' : '\u2728 New Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="title"
          label="Task Title"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <Textarea
          id="description"
          label="Description"
          placeholder="Add some details..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="status"
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={TASK_STATUSES.map((s) => ({
              value: s,
              label: `${STATUS_CONFIG[s].emoji} ${STATUS_CONFIG[s].label}`,
            }))}
          />

          <Select
            id="priority"
            label="Priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            options={TASK_PRIORITIES.map((p) => ({
              value: p,
              label: `${PRIORITY_CONFIG[p].emoji} ${PRIORITY_CONFIG[p].label}`,
            }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="due_date"
            label="Due Date"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />

          <Select
            id="assignee"
            label="Assign To"
            value={form.assignee_id}
            onChange={(e) => setForm({ ...form, assignee_id: e.target.value })}
            placeholder="Unassigned"
            options={profiles.map((p) => ({
              value: p.id,
              label: `${p.emoji} ${p.full_name}`,
            }))}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task \u{1F680}'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
