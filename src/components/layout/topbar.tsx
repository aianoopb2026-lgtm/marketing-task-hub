'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'
import { TeamAvatar } from '@/components/ui/avatar'

export function Topbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { profile } = useUser()
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-[#FAF9F7]/80 backdrop-blur-sm border-b border-[#E8E0D8] px-4 lg:px-6 h-14 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-[#F0EBE4] transition-colors"
        >
          <svg className="w-5 h-5 text-[#9C8E7C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="lg:hidden flex items-center gap-2">
          <span className="font-semibold text-[14px] text-[#2D2A26] tracking-tight">Marketing Task Hub</span>
        </div>
      </div>

      <div className="relative">
        {profile && (
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-[#F0EBE4] transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[13px] font-medium text-[#2D2A26]">{profile.full_name}</p>
              <p className="text-[11px] text-[#9C8E7C]">
                {profile.role === 'admin' ? 'Admin' : profile.title || 'Team Member'}
              </p>
            </div>
            <TeamAvatar emoji={profile.emoji} color={profile.avatar_color} size="sm" name={profile.full_name} />
          </button>
        )}

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-[0_8px_30px_rgba(140,100,60,0.12)] border border-[#E8E0D8] py-1.5 z-50">
              {profile && (
                <div className="px-4 py-3 border-b border-[#E8E0D8]/60">
                  <p className="text-[13px] font-medium text-[#2D2A26]">
                    {profile.full_name}
                  </p>
                  <p className="text-[12px] text-[#9C8E7C]">{profile.email}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-[13px] text-[#E5484D] hover:bg-red-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
