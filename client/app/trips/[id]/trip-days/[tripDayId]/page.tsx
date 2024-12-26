import { fetcherServer } from 'api'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tripDayId: string }>
}): Promise<Metadata> {
  const tripDayId = (await params).tripDayId

  // const tag = await fetcherServer<any>({ url: `tags/${tripDayId}` })

  return {
    title: tripDayId,
  }
}

const TripDay = () => {
  return <div>1111</div>
}

export default TripDay
