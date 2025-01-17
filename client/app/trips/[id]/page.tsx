'use client'
import { useEffect, useState } from 'react'
import { Button, Drawer } from 'antd'
import { useTanstackQuery, useTanstackMutation, useContextActions } from 'hooks'
import { useParams, useRouter } from 'next/navigation'
import { ICreateTrip, TripsNest } from 'types'
import { ImageCarousel, TripForm, TripDaysAccordion } from 'components'
import s from '../Trips.module.scss'

const Trip = () => {
  const [openDrawer, setDrawerStatus] = useState(false)
  const [initialValues, setInitialValues] = useState<undefined | ICreateTrip>(undefined)

  const { setInfoMsg, setErrorMsg } = useContextActions()

  const params = useParams()
  const id = Number(params.id)
  const router = useRouter()

  const { data: trip } = useTanstackQuery<TripsNest>({
    url: `trips/${id}`,
    queryKey: ['trips', `${id}`],
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
    if (trip) {
      const { comment, title, startDate, finishDate } = trip
      setInitialValues({
        title,
        startDate,
        finishDate,
        ...(!!comment && { comment }),
      })
    }

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
        <div className={s.tripItemWrapper}>
          <div className={s.title}>{trip.title}</div>
          <div className={s.editBtnWrapper}>
            <Button onClick={onEdit}>Edit</Button>
            <Button onClick={onDelete}>Delete</Button>
          </div>
          <ImageCarousel images={trip.images} />
          <TripDaysAccordion
            unassignedPlacesId={trip?.unassignedPlaces?.id}
            tripDays={trip.tripDays}
          />
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
              initialValues={initialValues}
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
