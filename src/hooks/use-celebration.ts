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
      colors: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
    })

    // Second burst - right side
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.8, y: 0.6 },
        colors: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
      })
    }, 150)

    // Third burst - center top with stars
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        shapes: ['star'],
        colors: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
      })
    }, 300)
  }, [])

  return { celebrate }
}
