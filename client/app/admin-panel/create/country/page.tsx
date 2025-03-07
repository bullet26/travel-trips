import { CountryForm } from 'components'
import s from '../Create.module.scss'

const CreateCountry = () => {
  return (
    <div>
      <div className={s.title}>Create new country</div>
      <CountryForm mode="create" />
    </div>
  )
}

export default CreateCountry
