'use client'

import { Button } from 'antd'
import Link from 'next/link'
import { useTanstackQuery } from 'hooks'
import { UserNestInfo, TripsNest } from 'types'
import { Card } from 'components'
import s from './Trips.module.scss'

const Trips = () => {
  const { data: user } = useTanstackQuery<UserNestInfo>({
    url: 'users/me',
    queryKey: ['users'],
  })

  const { data: trips } = useTanstackQuery<TripsNest[]>({
    url: 'trips/user',
    queryKey: ['trips'],
    id: user?.userId,
  })

  return (
    <>
      <Link href="/trips/create">
        <Button type="primary" className={s.mainBtn}>
          Create new trip
        </Button>
      </Link>
      <div className={s.tripWrapper}>
        {trips?.map((item) => (
          <Card
            key={item.id}
            imgUrl={item.images?.at(0)?.url}
            title={item.title}
            routeHref={`/trips/${item.id}`}
          />
        ))}
      </div>
    </>
  )
}

export default Trips
