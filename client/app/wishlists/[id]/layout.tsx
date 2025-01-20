import { Metadata } from 'next'
import { fetcherServer } from 'api'
import { IDParams, WishlistNest } from 'types'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const wishlist = await fetcherServer<WishlistNest>({ url: `wishlists/${id}` })

  return {
    title: wishlist.title,
  }
}

const WishlistLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default WishlistLayout
