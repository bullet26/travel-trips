'use client'

import { FC, useEffect } from 'react'
import { message } from 'antd'
import { useContextValues } from 'hooks'

export const ErrorMessage: FC = () => {
  const { errorMsg } = useContextValues()

  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (errorMsg) {
      messageApi.open({
        type: 'error',
        content: errorMsg,
      })
    }
  }, [errorMsg, messageApi])

  return <>{contextHolder}</>
}
