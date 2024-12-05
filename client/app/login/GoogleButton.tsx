'use client'

import { Button } from 'antd'
import { useRouter } from 'next/navigation'

const GoogleButton = () => {
  const router = useRouter()

  const onClick = () => router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`)

  return <Button onClick={onClick}>Sign in with Google</Button>
}

export default GoogleButton
