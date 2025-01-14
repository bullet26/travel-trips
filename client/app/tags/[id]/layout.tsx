import { Metadata } from 'next'
import { fetcherServer } from 'api'
import { TagNest, IDParams } from 'types'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const tag = await fetcherServer<TagNest>({ url: `tags/${id}` })

  return {
    title: `#${tag.name}`,
  }
}

const TagLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <>{children}</>
}

export default TagLayout
