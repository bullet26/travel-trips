import { Tag as AntdTag } from 'antd'
import { TagNest } from 'types'
import Link from 'next/link'
import { Metadata } from 'next'
import { fetcherServer } from 'api'
import s from './Tags.module.scss'

export const metadata: Metadata = {
  title: 'Tags',
}

const Tags = async () => {
  const tags = await fetcherServer<TagNest[]>({ url: 'tags' })

  return (
    <>
      <div className={s.title}>All tags: </div>
      <div className={s.wrapper}>
        {tags.map((item) => (
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
