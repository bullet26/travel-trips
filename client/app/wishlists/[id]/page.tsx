import { Metadata } from 'next'
import { IDParams } from 'types'

export async function generateMetadata({ params }: IDParams): Promise<Metadata> {
  const id = (await params).id
  // const post = await getData(id);

  return {
    title: `Wishlist ${id}`,
  }
}

const Wishlist = () => {
  return <div>1111</div>
}

export default Wishlist
