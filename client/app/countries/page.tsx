import { Card } from 'components'
import { fetcherServer } from 'api'
import { CountryNest } from 'types'
import { Metadata } from 'next'
import s from './Countries.module.scss'

export const metadata: Metadata = {
  title: 'Countries',
}

const Countries = async () => {
  const country = await fetcherServer<CountryNest[]>({ url: `countries/` })

  return (
    <div className={s.wrapper}>
      {country?.map((item) => (
        <Card
          key={item.id}
          imgUrl={item.images?.at(0)?.url}
          title={item.name}
          routeHref={`/countries/${item.id}`}
        />
      ))}
    </div>
  )
}

export default Countries
