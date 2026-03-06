'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TaskDetail } from '@/components/tasks/task-detail'
import type { TaskWithProfiles, Profile } from '@/types/database'

export default function TaskDetailPage() {
  const { taskId } = useParams()
  const router = useRouter()
  const [task, setTask] = useState<TaskWithProfiles | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchTask() {
      const [taskRes, profilesRes] = await Promise.all([
        fetch(`/api/tasks/${taskId}`),
        supabase.from('profiles').select('*').order('full_name'),
      ])
      if (taskRes.ok) setTask(await taskRes.json())
      if (profilesRes.data) setProfiles(profilesRes.data)
    }
    fetchTask()
  }, [taskId, supabase])

  if (!task) return null

  return (
    <TaskDetail
      task={task}
      onClose={() => router.push('/tasks')}
      onEdit={() => router.push('/tasks')}
      onDelete={async () => {
        await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
        router.push('/tasks')
      }}
      profiles={profiles}
    />
  )
}
