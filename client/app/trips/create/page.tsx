import { TripForm } from 'components'
import s from '../Trips.module.scss'

const CreateTrip = () => {
  return (
    <div>
      <div className={s.title}>Create new trip</div>
      <TripForm mode="crete" />
    </div>
  )
}

export default CreateTrip
