'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'
import { useRealtime } from '@/hooks/use-realtime'
import { TeamAvatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { timeAgo } from '@/lib/utils'
import type { CommentWithProfile, Profile, Comment } from '@/types/database'

interface CommentSectionProps {
  taskId: string
  profiles: Profile[]
}

export function CommentSection({ taskId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentWithProfile[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const { profile } = useUser()
  const supabase = createClient()

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profile:profiles(*)')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true })

    if (data) setComments(data as CommentWithProfile[])
  }, [supabase, taskId])

  useEffect(() => { fetchComments() }, [fetchComments])

  useRealtime<Comment>({
    table: 'comments',
    filter: `task_id=eq.${taskId}`,
    onInsert: () => fetchComments(),
    onDelete: () => fetchComments(),
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return
    setLoading(true)

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId, content: newComment }),
    })

    if (res.ok) {
      setNewComment('')
      fetchComments()
    }
    setLoading(false)
  }

  async function handleDelete(commentId: string) {
    await fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
    fetchComments()
  }

  return (
    <div>
      <h3 className="font-semibold text-[#2D2A26] mb-4">
        Comments ({comments.length})
      </h3>

      {/* Comment list */}
      <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 group">
            <TeamAvatar
              emoji={comment.profile.emoji}
              color={comment.profile.avatar_color}
              size="sm"
              name={comment.profile.full_name}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#2D2A26]">
                  {comment.profile.full_name}
                </span>
                <span className="text-xs text-[#9C8E7C]">
                  {timeAgo(comment.created_at)}
                </span>
                {profile?.id === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-sm text-[#4A4039] mt-0.5 whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-[#9C8E7C] text-center py-4">
            No comments yet
          </p>
        )}
      </div>

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        {profile && (
          <TeamAvatar
            emoji={profile.emoji}
            color={profile.avatar_color}
            size="sm"
            name={profile.full_name}
          />
        )}
        <div className="flex-1 flex gap-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={1}
            className="min-h-[38px] py-2"
          />
          <Button type="submit" size="sm" disabled={loading || !newComment.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}
