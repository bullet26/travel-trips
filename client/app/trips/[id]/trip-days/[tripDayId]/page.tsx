import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tripDayId: string }>
}): Promise<Metadata> {
  const tripDayId = (await params).tripDayId

  // const post = await getData(tripDayId);

  return {
    title: `TripDay ${tripDayId}`,
  }
}

const TripDay = () => {
  return <div>1111</div>
}

export default TripDay
