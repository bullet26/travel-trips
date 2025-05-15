import { Metadata } from 'next'
import { fetcherServer } from 'api'
import { PlaceNest, IDParams } from 'types'
import { getOriginURl } from 'utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const place = await fetcherServer<PlaceNest>({ url: `places/${id}` })
  const origin = await getOriginURl()

  return {
    title: place.name,
    openGraph: {
      title: place.name,
      description: `City: ${place.city?.name}. ${place.description
        ?.split(' ')
        .slice(0, 25)
        .join(' ')}...`,
      url: `${origin}/places/${id}`,
      images: [
        {
          url: place.images.at(0)?.url || '',
          width: 800,
          height: 600,
          alt: `Place ${place.name}`,
        },
      ],
    },
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
