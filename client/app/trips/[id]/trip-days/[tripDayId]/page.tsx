'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons'
import { useTanstackQuery } from 'hooks'
import { TripDayNest } from 'types'
import { formatToDateString } from 'utils'
import s from '../../../Trips.module.scss'

const TripDay = () => {
  const params = useParams()
  const id = Number(params.tripDayId)
  const tripId = Number(params.id)

  const { data: tripDay } = useTanstackQuery<TripDayNest>({
    url: 'trips-day',
    queryKey: ['trips-day'],
    id,
  })

  return (
    <div>
      {tripDay && (
        <>
          <div className={s.title}>
            <span>{formatToDateString(tripDay.date)}</span>
            <Link href={`/trips/${tripId}`}>
              <Button icon={<ArrowUpOutlined />} />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default TripDay
