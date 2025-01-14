import { TripForm } from 'components'
import s from '../Trips.module.scss'

const CreateTrip = () => {
  return (
    <div>
      <div className={s.title}>Create new trip</div>
      <TripForm mode="create" />
    </div>
  )
}

export default CreateTrip
