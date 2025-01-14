import { Metadata } from 'next'
import { fetcherServer } from 'api'
import { CityNest, IDParams } from 'types'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const city = await fetcherServer<CityNest>({ url: `cities/${id}` })

  return {
    title: city.name,
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
