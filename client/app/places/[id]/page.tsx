import { Metadata } from 'next'
import Link from 'next/link'
import { Tag } from 'antd'
import { fetcherServer } from 'api'
import { PlaceNest, IDParams } from 'types'
import { ImageCarousel } from 'components'
import s from './Places.module.scss'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const place = await fetcherServer<PlaceNest>({ url: `places/${id}` })

  return {
    title: place.name,
  }
}

const Place = async ({ params }: { params: Promise<IDParams> }) => {
  const id = (await params).id

  const place = await fetcherServer<PlaceNest>({ url: `places/${id}` })

  return (
    <div className={s.itemWrapper}>
      <div className={s.title}>
        <span>{place.name}</span>,&nbsp;
        <Link href={`/cities/${place.city?.id}`}>{place.city?.name}</Link>
      </div>
      <ImageCarousel images={place.images} />
      {place.tags?.map(({ id, name }) => (
        <Link href={`/tags/${id}`} key={id}>
          <Tag color="red" bordered={false}>
            <div>#{name}</div>
          </Tag>
        </Link>
      ))}
      <div className={s.addressWrapper}>
        <span>Address:</span> <span className={s.address}>{place.address}</span>
      </div>
      <div className={s.description}>{place.description}</div>
    </div>
  )
}

export default Place
