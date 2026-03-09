'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}

export function Dialog({ open, onClose, children, title, className }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className="fixed inset-0 bg-[#2D2A26]/60 backdrop-blur-[2px] animate-in fade-in duration-200" />
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-[0_8px_40px_rgba(140,100,60,0.15)] w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-200',
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D8]">
            <h2 className="text-lg font-semibold text-[#2D2A26]">{title}</h2>
            <button
              onClick={onClose}
              className="text-[#9C8E7C] hover:text-[#4A4039] transition-colors p-1 rounded-lg hover:bg-[#F0EBE4]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
