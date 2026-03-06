'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { TeamAvatar } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { timeAgo } from '@/lib/utils'
import type { ActivityLog, Profile } from '@/types/database'

type ActivityWithProfile = ActivityLog & { profile: Profile }

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchActivities = useCallback(async () => {
    const { data } = await supabase
      .from('activity_log')
      .select('*, profile:profiles(*)')
      .order('created_at', { ascending: false })
      .limit(20)

    if (data) setActivities(data as ActivityWithProfile[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchActivities() }, [fetchActivities])

  useRealtime<ActivityLog>({
    table: 'activity_log',
    onInsert: () => fetchActivities(),
  })

  function getActivityText(activity: ActivityWithProfile) {
    const details = activity.details as Record<string, string> | null
    const taskTitle = details?.title || 'a task'

    switch (activity.action) {
      case 'task_created':
        return <>created <strong>{taskTitle}</strong></>
      case 'task_completed':
        return <>completed <strong>{taskTitle}</strong></>
      case 'task_status_changed':
        return <>moved <strong>{taskTitle}</strong> to <strong>{details?.new?.replace('_', ' ')}</strong></>
      case 'task_reassigned':
        return <>reassigned <strong>{taskTitle}</strong></>
      case 'task_deleted':
        return <>deleted <strong>{taskTitle}</strong></>
      case 'comment_added':
        return <>commented on a task</>
      default:
        return <>performed an action</>
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-2 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start">
                <TeamAvatar
                  emoji={activity.profile.emoji}
                  color={activity.profile.avatar_color}
                  size="sm"
                  name={activity.profile.full_name}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    <strong className="text-gray-900">{activity.profile.full_name}</strong>{' '}
                    {getActivityText(activity)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(activity.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
