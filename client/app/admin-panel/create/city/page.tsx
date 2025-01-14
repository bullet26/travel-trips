import { CityForm } from 'components'
import s from '../Create.module.scss'

const CreateCity = () => {
  return (
    <div>
      <div className={s.title}>Create new city</div>
      <CityForm mode="create" />
    </div>
  )
}

export default CreateCity
