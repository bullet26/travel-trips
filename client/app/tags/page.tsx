'use client'

import { Tag as AntdTag } from 'antd'
import { TagNest } from 'types'
import Link from 'next/link'
import { useTanstackQuery } from 'hooks'
import s from './Tags.module.scss'

const Tags = () => {
  const { data: tags } = useTanstackQuery<TagNest[]>({ url: 'tags', queryKey: ['tags'] })

  return (
    <>
      <div className={s.title}>All tags: </div>
      <div className={s.wrapper}>
        {tags?.map((item) => (
          <Link href={`/tags/${item.id}`} key={item.id}>
            <AntdTag color="red" bordered={false}>
              <div>#{item?.name}</div>
            </AntdTag>
          </Link>
        ))}
      </div>
    </>
  )
}

export default Tags
