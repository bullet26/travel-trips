import { Metadata } from 'next'
import { fetcherServer } from 'api'
import { CityNest, IDParams } from 'types'
import { getOriginURl } from 'utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const city = await fetcherServer<CityNest>({ url: `cities/${id}` })
  const origin = await getOriginURl()

  return {
    title: city.name,
    openGraph: {
      title: city.name,
      description: `Country: ${city.country?.name}, places: ${
        city.places?.slice(0, 20).join(', ') || ''
      }`,
      url: `${origin}/cities/${id}`,
      images: [
        {
          url: city.images.at(0)?.url || '',
          width: 800,
          height: 600,
          alt: `City ${city.name}`,
        },
      ],
    },
  }
}

const CitiesLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default CitiesLayout
