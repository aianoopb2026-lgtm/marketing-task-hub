'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function PendingApprovalPage() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null)
  const [checking, setChecking] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function checkStatus() {
    setChecking(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', user.id)
      .single()

    if (profile?.status === 'approved') {
      router.push('/dashboard')
      router.refresh()
      return
    }

    setStatus(profile?.status ?? 'pending')
    setChecking(false)
  }

  useEffect(() => { checkStatus() }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isRejected = status === 'rejected'

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D8] p-8 shadow-[0_4px_20px_rgba(140,100,60,0.08)] text-center">
      {/* Clock/Status icon */}
      <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-[#F0EBE4] flex items-center justify-center">
        {isRejected ? (
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-[#9C8E7C]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        )}
      </div>

      {isRejected ? (
        <>
          <h2 className="text-lg font-semibold text-[#2D2A26] mb-2 tracking-tight">
            Account request not approved
          </h2>
          <p className="text-[14px] text-[#9C8E7C] leading-relaxed">
            Please contact your team administrator for more information.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-[#2D2A26] mb-2 tracking-tight">
            Your account is pending approval
          </h2>
          <p className="text-[14px] text-[#9C8E7C] leading-relaxed">
            An administrator will review your request.<br />
            You&apos;ll be able to access the app once approved.
          </p>
        </>
      )}

      <div className="flex items-center justify-center gap-3 mt-8">
        {!isRejected && (
          <Button
            onClick={checkStatus}
            disabled={checking}
            variant="primary"
          >
            {checking ? 'Checking...' : 'Check again'}
          </Button>
        )}
        <Button onClick={handleSignOut} variant="secondary">
          Sign out
        </Button>
      </div>
    </div>
  )
}
