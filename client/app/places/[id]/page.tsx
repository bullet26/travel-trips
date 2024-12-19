import { Metadata } from 'next'
import { IDParams } from 'types'

export async function generateMetadata({ params: { id } }: IDParams): Promise<Metadata> {
  // const post = await getData(id);

  return {
    title: 'Place id',
  }
}

const Place = () => {
  return <div>1111</div>
}

export default Place
