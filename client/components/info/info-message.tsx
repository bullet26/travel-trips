'use client'

import { FC, useEffect } from 'react'
import { message } from 'antd'
import { useContextValues } from 'hooks'

export const InfoMessage: FC = () => {
  const { infoMsg } = useContextValues()

  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (infoMsg) {
      messageApi.open({
        type: 'success',
        content: infoMsg,
      })
    }
  }, [infoMsg, messageApi])

  return <>{contextHolder}</>
}
