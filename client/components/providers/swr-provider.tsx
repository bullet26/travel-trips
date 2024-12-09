'use client'
import { SWRConfig } from 'swr'
import { fetcher } from 'api'

export const SWRProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <SWRConfig
      value={{
        loadingTimeout: 60000,
        fetcher,
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          if (retryCount >= 2 || error.status === 401 || error.status === 400) return
          setTimeout(() => revalidate({ retryCount }), 5000)
        },
      }}>
      {children}
    </SWRConfig>
  )
}
