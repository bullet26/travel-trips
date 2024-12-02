'use client'

import React from 'react'
import { theme } from 'antd'
import { ConfigProvider } from 'antd'

export const AntdTheme = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => (
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: '#800020',
      },
    }}>
    {children}
  </ConfigProvider>
)
