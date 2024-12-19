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
        colorPrimaryBorder: '#dc143c',
      },
      components: {
        Menu: {
          darkItemBg: '#191919',
          darkSubMenuItemBg: '#191919',
        },
      },
    }}>
    {children}
  </ConfigProvider>
)
