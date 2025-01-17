'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Tag as AntdTag, Button } from 'antd'
import { useTanstackQuery } from 'hooks'
import { TagNest } from 'types'
import { Card } from 'components'
import s from '../Tags.module.scss'

const Tag = () => {
  const params = useParams()
  const id = params.id

  const { data: tag } = useTanstackQuery<TagNest>({
    url: `tags/${id}`,
    queryKey: ['tags', `${id}`],
  })

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
