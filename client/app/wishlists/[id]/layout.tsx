import { Metadata } from 'next'
import { fetcherServer } from 'api'
import { CityNest, IDParams } from 'types'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const wishlist = await fetcherServer<CityNest>({ url: `wishlists/${id}` })

  return {
    title: wishlist.name,
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
