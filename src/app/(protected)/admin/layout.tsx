'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      const profile = data as Profile | null

      if (profile?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      setAuthorized(true)
      setLoading(false)
    }

    checkAdmin()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-sm text-neutral-500">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!authorized) return null

  return <>{children}</>
}
