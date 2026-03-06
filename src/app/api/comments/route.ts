import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCommentSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = createCommentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      ...parsed.data,
      user_id: user.id,
    })
    .select('*, profile:profiles(*)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Log activity
  await supabase.from('activity_log').insert({
    user_id: user.id,
    action: 'comment_added',
    task_id: parsed.data.task_id,
    details: { content_preview: parsed.data.content.slice(0, 100) },
  })

  return NextResponse.json(data, { status: 201 })
}
