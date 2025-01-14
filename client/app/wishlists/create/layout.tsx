import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create new wishlist',
}

const WishlistsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default WishlistsLayout
