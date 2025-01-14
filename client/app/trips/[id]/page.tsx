'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, Card, Drawer } from 'antd'
import { useTanstackQuery, useTanstackMutation, useContextActions } from 'hooks'
import { useParams, useRouter } from 'next/navigation'
import { TripsNest } from 'types'
import { ImageCarousel, TripForm } from 'components'
import { formatToDateString } from 'utils'
import s from '../Trips.module.scss'

const Trip = () => {
  const [openDrawer, setDrawerStatus] = useState(false)

  const { setInfoMsg, setErrorMsg } = useContextActions()

  const params = useParams()
  const id = Number(params.id)
  const router = useRouter()

  const { data: trip } = useTanstackQuery<TripsNest>({
    url: 'trips',
    queryKey: ['trips'],
    id,
  })

  const mutation = useTanstackMutation<{ message: string }>({
    url: 'trips',
    method: 'DELETE',
    queryKey: ['trips'],
    onSuccess: (data) => {
      if (data) {
        router.push('/trips')

        setInfoMsg(data.message)
      }
    },
  })

  useEffect(() => {
    if (mutation.error?.message) setErrorMsg(mutation.error?.message)
  }, [mutation.error?.message])

  const onEdit = () => {
    setDrawerStatus(true)
  }

  const onDelete = () => {
    mutation.mutate({ id })
  }

  const onClose = () => {
    setDrawerStatus(false)
  }

  return (
    <div>
      {trip && (
        <div className={s.tripWrapper}>
          <div className={s.title}>{trip.title}</div>
          <div className={s.editBtnWrapper}>
            <Button onClick={onEdit}>Edit</Button>
            <Button onClick={onDelete}>Delete</Button>
          </div>
          <ImageCarousel images={trip.images} />
          <Link href={`/trips/${id}/unassigned-places/${trip?.unassignedPlaces?.id}`}>
            <Card>
              <div>unassigned places</div>
            </Card>
          </Link>

          {trip.tripDays?.map((item) => (
            <Link key={item.id} href={`/trips/${id}/trip-days/${item.id}`}>
              <Card>
                <div>{formatToDateString(item.date)}</div>
              </Card>
            </Link>
          ))}
          {!!trip?.comment && <p className={s.comment}>{trip.comment}</p>}
          <Drawer
            title="Update trip"
            onClose={onClose}
            open={openDrawer}
            width={800}
            destroyOnClose>
            <TripForm
              mode="update"
              id={id}
              initialValues={{ ...trip, ...(!!trip?.comment && { comment: trip.comment }) }}
              images={trip.images}
              onSuccess={onClose}
            />
          </Drawer>
        </div>
      )}
    </div>
  )
}

export default Trip
