'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useIsAdmin } from '@/hooks/use-is-admin'

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    href: '/tasks',
    label: 'Task Board',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15M4.5 4.5h15c.828 0 1.5.672 1.5 1.5v12c0 .828-.672 1.5-1.5 1.5h-15A1.5 1.5 0 013 18V6c0-.828.672-1.5 1.5-1.5z" />
      </svg>
    ),
  },
  {
    href: '/my-tasks',
    label: 'My Tasks',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
]

const adminItems = [
  {
    href: '/admin',
    label: 'Admin Panel',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isAdmin } = useIsAdmin()

  const allItems = isAdmin ? [...navItems, ...adminItems] : navItems

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[260px] bg-[#09090b] border-r border-white/[0.06] h-screen sticky top-0">
      <div className="px-5 py-6 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm tracking-tight">M</span>
          </div>
          <div>
            <h1 className="font-semibold text-white text-[15px] leading-tight tracking-tight">Marketing</h1>
            <p className="text-[11px] text-neutral-500 font-medium tracking-wide uppercase">Task Hub</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto dark-scrollbar">
        {allItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150',
                isActive
                  ? 'bg-white/[0.08] text-white'
                  : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/[0.06]">
        <div className="bg-white/[0.03] rounded-md px-3 py-2.5 border border-white/[0.06]">
          <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Pro tip</p>
          <p className="text-[12px] text-neutral-500 mt-1 leading-relaxed">
            Drag tasks between columns to update their status.
          </p>
        </div>
      </div>
    </aside>
  )
}
