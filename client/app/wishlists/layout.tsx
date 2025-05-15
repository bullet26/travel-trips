import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My wishlists 🗺️',
}

const WishlistsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default WishlistsLayout
