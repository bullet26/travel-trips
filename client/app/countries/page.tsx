'use client'

import { Card } from 'components'
import { useTanstackQuery } from 'hooks'
import { CountryNest } from 'types'
import s from './Countries.module.scss'

const Countries = () => {
  const { data: countries } = useTanstackQuery<CountryNest[]>({
    url: 'countries',
    queryKey: ['countries'],
  })

  return (
    <>
      <div className={s.wrapper}>
        {countries?.map((item) => (
          <Card
            key={item.id}
            imgUrl={item.images?.at(0)?.url}
            title={item.name}
            routeHref={`/countries/${item.id}`}
          />
        ))}
      </div>
    </>
  )
}

export default Countries
