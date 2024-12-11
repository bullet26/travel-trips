'use client'

import { Button } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const GoogleButton = () => {
  const router = useRouter()

  const onClick = () => router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`)

  return (
    <Button icon={<GoogleOutlined />} onClick={onClick}>
      Google
    </Button>
  )
}

export default GoogleButton
