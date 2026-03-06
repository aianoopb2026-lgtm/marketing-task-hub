'use client'

import { useUser } from './use-user'

export function useIsAdmin() {
  const { profile, loading } = useUser()
  return { isAdmin: profile?.role === 'admin', loading }
}
