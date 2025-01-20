'use client'

import { useRouter } from 'next/navigation'
import { TripForm } from 'components'
import s from '../Trips.module.scss'

const CreateTrip = () => {
  const router = useRouter()
  const onSuccess = () => router.push('/trips')

  return (
    <div>
      <div className={s.title}>Create new trip</div>
      <TripForm mode="create" onSuccess={onSuccess} />
    </div>
  )
}

export default CreateTrip
