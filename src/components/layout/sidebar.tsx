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
  { href: '/admin', label: 'Admin Panel', emoji: '\u{1F6E1}\uFE0F' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isAdmin } = useIsAdmin()

  const allItems = isAdmin ? [...navItems, ...adminItems] : navItems

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="text-3xl">{'\u{1F680}'}</span>
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-tight">Marketing</h1>
            <p className="text-xs text-gray-500 font-medium">Task Hub</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {allItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span className="text-lg">{item.emoji}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
          <p className="text-xs font-medium text-indigo-700">{'\u{1F4A1}'} Tip of the day</p>
          <p className="text-xs text-gray-600 mt-1">
            Drag tasks between columns to update their status!
          </p>
        </div>
      </div>
    </aside>
  )
}
