import { Metadata } from 'next'
import { fetcherServer } from 'api'
import { PlaceNest, IDParams } from 'types'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const place = await fetcherServer<PlaceNest>({ url: `places/${id}` })

  return {
    title: place.name,
  }
}

const PlacesLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default PlacesLayout
