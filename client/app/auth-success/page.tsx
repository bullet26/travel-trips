'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const accessToken = searchParams.get('accessToken')
  const accessTokenExpires = searchParams.get('accessTokenExpires')

  useEffect(() => {
    if (accessToken) {
      signIn('google', {
        accessToken,
        accessTokenExpires,
        callbackUrl: '/',
      })
    }
  }, [accessToken, accessTokenExpires, router])

  return <div>Auth complied. Redirecting...</div>
}
