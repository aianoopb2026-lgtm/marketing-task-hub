'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TeamAvatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types/database'

interface MemberStats {
  id: string
  name: string
  emoji: string
  color: string
  assigned: number
  completed: number
  in_progress: number
}

interface Stats {
  totalTasks: number
  byStatus: { todo: number; in_progress: number; done: number }
  byPriority: { high: number; medium: number; low: number }
  memberStats: MemberStats[]
}

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const [profilesRes, statsRes] = await Promise.all([
      supabase.from('profiles').select('*').order('full_name'),
      fetch('/api/admin/stats'),
    ])

    if (profilesRes.data) setProfiles(profilesRes.data)
    if (statsRes.ok) setStats(await statsRes.json())
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  async function updateRole(userId: string, role: string) {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    })

    if (res.ok) {
      toast('Role updated', 'success')
      fetchData()
    } else {
      toast('Failed to update role', 'error')
    }
  }

  async function updateStatus(userId: string, status: 'approved' | 'rejected') {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, status }),
    })

    if (res.ok) {
      toast(`User ${status}`, 'success')
      fetchData()
    } else {
      toast(`Failed to update user`, 'error')
    }
  }

  const pendingUsers = profiles.filter(p => p.status === 'pending')

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your team and view analytics</p>
      </div>

      {/* Pending Approvals */}
      {pendingUsers.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
              <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200">
                {pendingUsers.length} pending
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                  <div className="flex items-center gap-3">
                    <TeamAvatar emoji={user.emoji} color={user.avatar_color} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="primary" onClick={() => updateStatus(user.id, 'approved')}>
                      Approve
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => updateStatus(user.id, 'rejected')}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold text-indigo-600">{stats.totalTasks}</p>
              <p className="text-sm text-gray-500 mt-1">Total Tasks</p>
              <div className="flex justify-center gap-4 mt-3 text-xs">
                <span className="text-slate-600">{stats.byStatus.todo} todo</span>
                <span className="text-blue-600">{stats.byStatus.in_progress} active</span>
                <span className="text-green-600">{stats.byStatus.done} done</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold text-green-600">
                {stats.totalTasks > 0 ? Math.round((stats.byStatus.done / stats.totalTasks) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Completion Rate</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-green-500 rounded-full h-2 transition-all duration-500"
                  style={{
                    width: `${stats.totalTasks > 0 ? (stats.byStatus.done / stats.totalTasks) * 100 : 0}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold text-red-600">{stats.byPriority.high}</p>
              <p className="text-sm text-gray-500 mt-1">High Priority</p>
              <div className="flex justify-center gap-4 mt-3 text-xs">
                <span className="text-yellow-600">{stats.byPriority.medium} medium</span>
                <span className="text-green-600">{stats.byPriority.low} low</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Team Performance */}
      {stats && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Team Performance</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.memberStats.map((member) => {
                const total = member.assigned
                const completionRate = total > 0 ? Math.round((member.completed / total) * 100) : 0

                return (
                  <div key={member.id} className="flex items-center gap-4">
                    <TeamAvatar
                      emoji={member.emoji}
                      color={member.color}
                      size="md"
                      name={member.name}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 truncate">{member.name}</span>
                        <span className="text-xs text-gray-500">
                          {member.completed}/{total} tasks ({completionRate}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="flex h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-green-500 transition-all duration-500"
                            style={{ width: `${total > 0 ? (member.completed / total) * 100 : 0}%` }}
                          />
                          <div
                            className="bg-blue-400 transition-all duration-500"
                            style={{ width: `${total > 0 ? (member.in_progress / total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Management */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Team Management</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Member</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Title</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <TeamAvatar
                          emoji={member.emoji}
                          color={member.avatar_color}
                          size="sm"
                        />
                        <span className="font-medium text-gray-900">{member.full_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{member.title || '-'}</td>
                    <td className="py-3 px-2 text-gray-600">{member.email}</td>
                    <td className="py-3 px-2">
                      <Select
                        value={member.role}
                        onChange={(e) => updateRole(member.id, e.target.value)}
                        options={[
                          { value: 'member', label: 'Member' },
                          { value: 'admin', label: 'Admin' },
                        ]}
                        className={cn(
                          'w-32 text-xs',
                          member.role === 'admin' && 'border-indigo-300 bg-indigo-50'
                        )}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <span className={cn(
                        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border',
                        member.status === 'approved' && 'bg-green-50 text-green-700 border-green-200',
                        member.status === 'pending' && 'bg-amber-50 text-amber-700 border-amber-200',
                        member.status === 'rejected' && 'bg-red-50 text-red-700 border-red-200',
                      )}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
