import { Metadata } from 'next'
import Link from 'next/link'
import { fetcherServer } from 'api'
import { CityNest, IDParams } from 'types'
import { Card, ImageCarousel } from 'components'
import { Tag } from 'antd'
import s from './Cities.module.scss'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const city = await fetcherServer<CityNest>({ url: `cities/${id}` })

  return {
    title: city.name,
  }
}

const City = async ({ params }: { params: Promise<IDParams> }) => {
  const id = (await params).id

  const city = await fetcherServer<CityNest>({ url: `cities/${id}` })

  return (
    <div className={s.itemWrapper}>
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
    </div>
  )
}

export default City
