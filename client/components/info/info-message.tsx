'use client'

import { FC, useEffect } from 'react'
import { message } from 'antd'

interface InfoMessageProps {
  msg?: string | null
}

export const InfoMessage: FC<InfoMessageProps> = (props) => {
  const { msg } = props

  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (msg) {
      messageApi.open({
        type: 'success',
        content: msg,
      })
    }
  }, [msg, messageApi])

  return <>{contextHolder}</>
}
