import { fetcherServer } from 'api'
import { Metadata } from 'next'
import { IDParams, TagNest } from 'types'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const tag = await fetcherServer<TagNest>({ url: `tags/${id}` })

  return {
    title: tag.name,
  }
}

const Tag = () => {
  return <div>1111</div>
}

export default Tag
