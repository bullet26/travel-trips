'use client'

import { SessionProvider } from 'next-auth/react'

export const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider refetchInterval={15 * 60}>{children}</SessionProvider>
}
