import { Metadata } from 'next'
import { fetcherServer } from 'api'
import { CountryNest, IDParams } from 'types'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const country = await fetcherServer<CountryNest>({ url: `countries/${id}` })

  return {
    title: country.name,
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
