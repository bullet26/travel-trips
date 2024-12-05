'use client'
import { SWRConfig } from 'swr'
import { fetcher } from '@/api'
import { useSession } from 'next-auth/react'

export const SWRProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const { data } = useSession()
  const token = data?.accessToken || null

  return (
    <SWRConfig
      value={{
        loadingTimeout: 60000,
        fetcher: (args) => fetcher({ ...args, token }),
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          if (retryCount >= 2 || error.status === 401) return
          setTimeout(() => revalidate({ retryCount }), 5000)
        },
      }}>
      {children}
    </SWRConfig>
  )
}
