import { Metadata } from 'next'
import { fetcherServer } from 'api'
import { CountryNest, IDParams } from 'types'
import { getOriginURl } from 'utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const country = await fetcherServer<CountryNest>({ url: `countries/${id}` })
  const origin = await getOriginURl()

  return {
    title: country.name,
    openGraph: {
      title: country.name,
      description: `Country ${country.name} with id ${id}`,
      url: `${origin}/countries/${id}`,
      images: [
        {
          url: country.images.at(0)?.url || '',
          width: 800,
          height: 600,
          alt: `Country ${country.name}`,
        },
      ],
    },
  }
}

const CountriesLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default CountriesLayout
