import { Metadata } from 'next'
import { fetcherServer } from 'api'
import { TripDayNest } from 'types'
import { formatToDateString } from 'utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tripDayId: string }>
}): Promise<Metadata> {
  const tripDayId = (await params).tripDayId

  const tripDay = await fetcherServer<TripDayNest>({ url: `trips-day/${tripDayId}` })

  return {
    title: formatToDateString(tripDay.date),
  }
}

const TripDayLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default TripDayLayout
