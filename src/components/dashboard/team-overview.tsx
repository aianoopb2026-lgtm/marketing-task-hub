'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TeamAvatar } from '@/components/ui/avatar'
import type { Profile, TaskWithProfiles } from '@/types/database'

interface TeamOverviewProps {
  profiles: Profile[]
  tasks: TaskWithProfiles[]
}

export function TeamOverview({ profiles, tasks }: TeamOverviewProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">The Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {profiles.map((member) => {
          const memberTasks = tasks.filter((t) => t.assignee_id === member.id)
          const activeTasks = memberTasks.filter((t) => t.status !== 'done')
          const completedTasks = memberTasks.filter((t) => t.status === 'done')

          return (
            <Card key={member.id} hover>
              <CardContent className="flex items-start gap-3">
                <TeamAvatar
                  emoji={member.emoji}
                  color={member.avatar_color}
                  size="lg"
                  name={member.full_name}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{member.full_name}</h3>
                  <p className="text-xs text-gray-500 truncate">{member.title || 'Team Member'}</p>
                  {member.role === 'admin' && (
                    <span className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded mt-1">
                      Admin
                    </span>
                  )}
                  <div className="flex gap-3 mt-2 text-xs">
                    <span className="text-blue-600 font-medium">{activeTasks.length} active</span>
                    <span className="text-green-600 font-medium">{completedTasks.length} done</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
