'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { TeamOverview } from '@/components/dashboard/team-overview'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines'
import type { TaskWithProfiles, Profile } from '@/types/database'

export default function DashboardPage() {
  const [tasks, setTasks] = useState<TaskWithProfiles[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const { profile } = useUser()
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const [tasksRes, profilesRes] = await Promise.all([
      supabase
        .from('tasks')
        .select('*, assignee:profiles!tasks_assignee_id_fkey(*), creator:profiles!tasks_creator_id_fkey(*)')
        .order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('full_name'),
    ])

    if (tasksRes.data) setTasks(tasksRes.data as TaskWithProfiles[])
    if (profilesRes.data) setProfiles(profilesRes.data)
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting()}, {profile?.full_name?.split(' ')[0]} {profile?.emoji}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your marketing team today
        </p>
      </div>

      {/* Stats */}
      <StatsCards tasks={tasks} />

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <UpcomingDeadlines tasks={tasks} />
      </div>

      {/* Team Overview */}
      <TeamOverview profiles={profiles} tasks={tasks} />
    </div>
  )
}
