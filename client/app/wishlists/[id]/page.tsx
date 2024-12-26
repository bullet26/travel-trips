import { fetcherServer } from 'api'
import { Metadata } from 'next'
import { IDParams } from 'types'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const tag = await fetcherServer<any>({ url: `tags/${id}` })

  return {
    title: tag.name,
  }
}

const Wishlist = () => {
  return <div>1111</div>
}

export default Wishlist
