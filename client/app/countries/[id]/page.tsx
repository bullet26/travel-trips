'use client'

import { CountryNest } from 'types'
import { useParams } from 'next/navigation'
import { Card, ImageCarousel } from 'components'
import { Tag } from 'antd'
import { useTanstackQuery } from 'hooks'
import s from '../Countries.module.scss'

const Country = () => {
  const params = useParams()
  const id = params.id

  const { data: country } = useTanstackQuery<CountryNest>({
    url: `countries/${id}`,
    queryKey: ['countries', `${id}`],
  })

  return (
    <div className={s.itemWrapper}>
      {country && (
        <>
          <div className={s.title}>{country.name}</div>
          {country.translations.map((item) => (
            <Tag color="red" key={item} bordered={false}>
              <div>#{item}</div>
            </Tag>
          ))}
          <ImageCarousel images={country.images} />
          <div className={s.wrapper}>
            {country.cities?.map((item) => (
              <Card
                key={item.id}
                imgUrl={item.images?.at(0)?.url}
                title={item.name}
                routeHref={`/cities/${item.id}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Country
