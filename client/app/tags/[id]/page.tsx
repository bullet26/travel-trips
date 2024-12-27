import { fetcherServer } from 'api'
import { Metadata } from 'next'
import Link from 'next/link'
import { Tag as AntdTag, Button } from 'antd'
import { IDParams, TagNest } from 'types'
import { Card } from 'components'
import s from '../Tags.module.scss'

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

const Tag = async ({ params }: { params: Promise<IDParams> }) => {
  const id = (await params).id
  const tag = await fetcherServer<TagNest>({ url: `tags/${id}` })

  console.log(tag)

  return (
    <>
      <div className={s.titleWrapper}>
        <AntdTag color="red" bordered={false}>
          <div className={s.title}>#{tag?.name}</div>
        </AntdTag>
        <Link href={`/tags`}>
          <Button type="text">To all tags</Button>
        </Link>
      </div>
      <div className={s.wrapper}>
        {tag?.places?.map((item) => (
          <Card
            key={item.id}
            imgUrl={item.images?.at(0)?.url}
            title={item.name}
            routeHref={`/places/${item.id}`}
          />
        ))}
      </div>
    </>
  )
}

export default Tag
