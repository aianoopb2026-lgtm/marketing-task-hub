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
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="lg:hidden flex items-center gap-2">
          <span className="text-2xl">{'\u{1F680}'}</span>
          <span className="font-bold text-gray-900">Marketing Task Hub</span>
        </div>
      </div>

      <div className="relative">
        {profile && (
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
              <p className="text-xs text-gray-500">
                {profile.role === 'admin' ? '\u{1F451} Admin' : profile.title || 'Team Member'}
              </p>
            </div>
            <TeamAvatar emoji={profile.emoji} color={profile.avatar_color} size="sm" name={profile.full_name} />
          </button>
        )}

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              {profile && (
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {profile.emoji} {profile.full_name}
                  </p>
                  <p className="text-xs text-gray-500">{profile.email}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                {'\u{1F6AA}'} Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
