import { Metadata } from 'next'
import { fetcherServer } from 'api'
import { CountryNest, IDParams } from 'types'
import { Card, ImageCarousel } from 'components'
import s from '../Countries.module.scss'
import { Tag } from 'antd'

export async function generateMetadata({
  params,
}: {
  params: Promise<IDParams>
}): Promise<Metadata> {
  const id = (await params).id

  const country = await fetcherServer<CountryNest>({ url: `countries/${id}` })

  return {
    title: country.name,
  }
}

const Country = async ({ params }: { params: Promise<IDParams> }) => {
  const id = (await params).id

  const country = await fetcherServer<CountryNest>({ url: `countries/${id}` })

  return (
    <div className={s.itemWrapper}>
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
    </div>
  )
}

export default Country
