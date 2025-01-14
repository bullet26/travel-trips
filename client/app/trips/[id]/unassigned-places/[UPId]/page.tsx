'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons'
import { useTanstackQuery } from 'hooks'
import { UnassignedPlacesNest } from 'types'
import s from '../../../Trips.module.scss'

const UnassignedPlaces = () => {
  const params = useParams()
  const id = Number(params.UPId)
  const tripId = Number(params.id)

  const { data: up } = useTanstackQuery<UnassignedPlacesNest>({
    url: 'unassigned-places',
    queryKey: ['unassigned-places'],
    id,
  })

  return (
    <div>
      {up && (
        <>
          <div className={s.title}>
            <span>Unassigned places</span>
            <Link href={`/trips/${tripId}`}>
              <Button icon={<ArrowUpOutlined />} />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default UnassignedPlaces
