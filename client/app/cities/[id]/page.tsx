'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CityNest } from 'types'
import { Card, ImageCarousel } from 'components'
import { Tag } from 'antd'
import { useTanstackQuery } from 'hooks'
import s from './Cities.module.scss'

const City = () => {
  const params = useParams()
  const id = params.id

  const { data: city } = useTanstackQuery<CityNest>({ url: 'cities', queryKey: ['cities'], id })

  return (
    <div className={s.itemWrapper}>
      {city && (
        <>
          <div className={s.title}>
            <span>{city.name}</span>,&nbsp;
            <Link href={`/countries/${city.country?.id}`}>{city.country?.name}</Link>
          </div>
          {city.translations.map((item) => (
            <Tag color="red" key={item} bordered={false}>
              <div>#{item}</div>
            </Tag>
          ))}
          <ImageCarousel images={city.images} />
          <div className={s.wrapper}>
            {city.places?.map((item) => (
              <Card
                key={item.id}
                imgUrl={item.images?.at(0)?.url}
                title={item.name}
                routeHref={`/places/${item.id}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default City
