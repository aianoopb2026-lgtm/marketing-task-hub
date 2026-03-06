'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useIsAdmin } from '@/hooks/use-is-admin'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', emoji: '\u{1F4CA}' },
  { href: '/tasks', label: 'Task Board', emoji: '\u{1F4CB}' },
  { href: '/my-tasks', label: 'My Tasks', emoji: '\u{1F464}' },
]

const adminItems = [
  { href: '/admin', label: 'Admin', emoji: '\u{1F6E1}\uFE0F' },
]

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const { isAdmin } = useIsAdmin()
  const allItems = isAdmin ? [...navItems, ...adminItems] : navItems

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 lg:hidden shadow-xl">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{'\u{1F680}'}</span>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">Marketing</h1>
                <p className="text-xs text-gray-500">Task Hub</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {allItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <span className="text-lg">{item.emoji}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
