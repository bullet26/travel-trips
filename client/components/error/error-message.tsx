'use client'

import { FC, useEffect } from 'react'
import { message } from 'antd'

interface ErrorMessageProps {
  msg?: string
}

export const ErrorMessage: FC<ErrorMessageProps> = (props) => {
  const { msg } = props

  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (msg) {
      messageApi.open({
        type: 'error',
        content: msg,
      })
    }
  }, [msg, messageApi])

  return <>{contextHolder}</>
}
