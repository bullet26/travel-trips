'use client'

import { useEffect } from 'react'
import { Button } from 'antd'
import Link from 'next/link'
import { useTanstackLazyQuery, useTanstackQuery } from 'hooks'
import { UserNestInfo, TripsNest } from 'types'
import { Card } from 'components'
import s from './Trips.module.scss'

const Trips = () => {
  const { data: user } = useTanstackQuery<UserNestInfo>({
    url: 'users/me',
    queryKey: ['users'],
  })

  const [trigger, { data: trips }] = useTanstackLazyQuery<TripsNest[], number>({
    url: 'trips/user',
    queryKey: ['trips'],
  })

  useEffect(() => {
    if (user?.userId) {
      trigger(user.userId)
    }
  }, [user?.userId])

  return (
    <>
      <Link href="/trips/create">
        <Button type="primary" className={s.mainBtn}>
          Create new trip
        </Button>
      </Link>
      <div className={s.tripsWrapper}>
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
