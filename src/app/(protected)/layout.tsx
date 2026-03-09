'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { ToastProvider } from '@/components/ui/toast'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#FAF9F7]">
        <Sidebar />
        <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar onMenuToggle={() => setMobileNavOpen(true)} />
          <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
