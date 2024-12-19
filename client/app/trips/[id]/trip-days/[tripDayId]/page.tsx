import { Metadata } from 'next'
import { IDParams } from 'types'

export async function generateMetadata({ params: { tripDayId } }: IDParams): Promise<Metadata> {
  // const post = await getData(tripDayId);

  return {
    title: 'TripDay id',
  }
}

const TripDay = () => {
  return <div>1111</div>
}

export default TripDay
