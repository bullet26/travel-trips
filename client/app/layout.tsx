import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { AntdTheme } from 'theme'
import 'styles/globals.scss'
import { SWRProvider } from 'components/providers/swr-provider'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Travel App',
  description:
    "This project is designed to help you keep track of the places you've visited, your impressions, and the photos you've taken. You can also create wishlists of places you'd like to visit, with notes for future trips.",
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AntdRegistry>
          <AntdTheme>
            <SWRProvider>{children}</SWRProvider>
          </AntdTheme>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default RootLayout
