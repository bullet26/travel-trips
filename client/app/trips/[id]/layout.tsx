import { Metadata } from 'next'
import { fetcherServer } from 'api'
import { IDParams, TripsNest } from 'types'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const trip = await fetcherServer<TripsNest>({ url: `trips/${id}` })

  return {
    title: trip.title,
  }
}

const TripLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default TripLayout
