import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check admin
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  const profile = profileData as Profile | null

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  // Get all tasks with profiles
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, assignee:profiles!tasks_assignee_id_fkey(full_name, emoji)')

  // Get all profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name')

  // Compute stats
  const totalTasks = tasks?.length || 0
  const byStatus = {
    todo: tasks?.filter((t) => t.status === 'todo').length || 0,
    in_progress: tasks?.filter((t) => t.status === 'in_progress').length || 0,
    done: tasks?.filter((t) => t.status === 'done').length || 0,
  }
  const byPriority = {
    high: tasks?.filter((t) => t.priority === 'high').length || 0,
    medium: tasks?.filter((t) => t.priority === 'medium').length || 0,
    low: tasks?.filter((t) => t.priority === 'low').length || 0,
  }

  // Per-member stats
  const memberStats = profiles?.map((p) => ({
    id: p.id,
    name: p.full_name,
    emoji: p.emoji,
    color: p.avatar_color,
    assigned: tasks?.filter((t) => t.assignee_id === p.id).length || 0,
    completed: tasks?.filter((t) => t.assignee_id === p.id && t.status === 'done').length || 0,
    in_progress: tasks?.filter((t) => t.assignee_id === p.id && t.status === 'in_progress').length || 0,
  })) || []

  return NextResponse.json({
    totalTasks,
    byStatus,
    byPriority,
    memberStats,
  })
}
