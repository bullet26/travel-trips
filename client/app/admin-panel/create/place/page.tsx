import { PlaceForm } from 'components'
import s from '../Create.module.scss'

const CreatePlace = () => {
  return (
    <div>
      <div className={s.title}>Create new place</div>
      <PlaceForm mode="crete" />
    </div>
  )
}

export default CreatePlace
