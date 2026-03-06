'use client'

import { useCallback } from 'react'
import confetti from 'canvas-confetti'

export function useCelebration() {
  const celebrate = useCallback(() => {
    // First burst - left side
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.2, y: 0.6 },
      colors: ['#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f97316'],
    })

    // Second burst - right side
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.8, y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f97316'],
      })
    }, 150)

    // Third burst - center top with stars
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        shapes: ['star'],
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'],
      })
    }, 300)
  }, [])

  return { celebrate }
}
