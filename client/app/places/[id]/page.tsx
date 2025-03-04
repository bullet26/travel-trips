'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Tag } from 'antd'
import { useTanstackQuery } from 'hooks'
import { PlaceNest } from 'types'
import { ImageCarousel } from 'components'
import { openGoogleMaps } from 'utils'
import s from './Places.module.scss'

const Place = () => {
  const params = useParams()
  const id = params.id

  const { data: place } = useTanstackQuery<PlaceNest>({
    url: `places/${id}`,
    queryKey: ['places', `${id}`],
  })

  return (
    <div className={s.itemWrapper}>
      {place && (
        <>
          <div className={s.title}>
            <span>{place.name}</span>,&nbsp;
            <Link href={`/cities/${place.city?.id}`}>{place.city?.name}</Link>
          </div>
          {place.translations.map((item) => (
            <Tag color="red" key={item} bordered={false}>
              <div>#{item}</div>
            </Tag>
          ))}
          <ImageCarousel images={place.images} />
          {place.tags?.map(({ id, name }) => (
            <Link href={`/tags/${id}`} key={id}>
              <Tag color="red-inverse" bordered={false}>
                <div>#{name}</div>
              </Tag>
            </Link>
          ))}
          <div className={s.addressWrapper}>
            <span>Address:</span> <span className={s.address}>{place.address}</span>
            <Image
              src="/gps.svg"
              alt="GPS"
              width={30}
              height={30}
              style={{ cursor: 'pointer' }}
              onClick={() => openGoogleMaps(place)}
            />
          </div>

          <div
            className={s.description} // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: place.description as TrustedHTML }}
          />
        </>
      )}
    </div>
  )
}

export default Place
