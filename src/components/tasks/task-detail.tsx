'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TeamAvatar } from '@/components/ui/avatar'
import { PriorityBadge } from '@/components/ui/badge'
import { STATUS_CONFIG } from '@/lib/constants'
import { cn, formatDate, timeAgo, isOverdue } from '@/lib/utils'
import { CommentSection } from '@/components/comments/comment-section'
import { useIsAdmin } from '@/hooks/use-is-admin'
import { useUser } from '@/hooks/use-user'
import type { TaskWithProfiles, Profile } from '@/types/database'

interface TaskDetailProps {
  task: TaskWithProfiles
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  profiles: Profile[]
}

export function TaskDetail({ task, onClose, onEdit, onDelete, profiles }: TaskDetailProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { isAdmin } = useIsAdmin()
  const { profile } = useUser()
  const statusConfig = STATUS_CONFIG[task.status]
  const overdue = isOverdue(task.due_date) && task.status !== 'done'
  const canEdit = isAdmin || profile?.id === task.creator_id || profile?.id === task.assignee_id
  const canDelete = isAdmin || profile?.id === task.creator_id

  return (
    <Dialog open={true} onClose={onClose} className="max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig.bgClass} ${statusConfig.textClass}`}>
              <span className={cn('w-1.5 h-1.5 rounded-full', statusConfig.dotColor)} />
              {statusConfig.label}
            </span>
            <PriorityBadge priority={task.priority} />
            {overdue && (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Overdue
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
        </div>

        {/* Description */}
        {task.description && (
          <div className="bg-neutral-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Created by</p>
            <div className="flex items-center gap-2">
              <TeamAvatar
                emoji={task.creator.emoji}
                color={task.creator.avatar_color}
                size="sm"
                name={task.creator.full_name}
              />
              <span className="font-medium text-gray-900">{task.creator.full_name}</span>
            </div>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Assigned to</p>
            {task.assignee ? (
              <div className="flex items-center gap-2">
                <TeamAvatar
                  emoji={task.assignee.emoji}
                  color={task.assignee.avatar_color}
                  size="sm"
                  name={task.assignee.full_name}
                />
                <span className="font-medium text-gray-900">{task.assignee.full_name}</span>
              </div>
            ) : (
              <span className="text-gray-400 italic">Unassigned</span>
            )}
          </div>
          <div>
            <p className="text-gray-500 mb-1">Due Date</p>
            <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-900'}>
              {task.due_date ? formatDate(task.due_date) : 'No deadline'}
            </span>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Created</p>
            <span className="text-gray-900">{timeAgo(task.created_at)}</span>
          </div>
        </div>

        {/* Comments */}
        <div className="border-t border-gray-100 pt-4">
          <CommentSection taskId={task.id} profiles={profiles} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-gray-100 pt-4">
          {canEdit && (
            <Button variant="secondary" onClick={onEdit} size="sm">
              Edit
            </Button>
          )}
          {canDelete && (
            <>
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-600">Are you sure?</span>
                  <Button variant="danger" size="sm" onClick={onDelete}>
                    Yes, Delete
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Delete
                </Button>
              )}
            </>
          )}
          <div className="flex-1" />
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
