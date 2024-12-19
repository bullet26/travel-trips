import { CreateCountryForm } from './CreateCountryForm'
import s from './Country.module.scss'

const CreateCountry = () => {
  return (
    <div>
      <div className={s.title}>Create new country</div>

      <CreateCountryForm />
    </div>
  )
}

export default CreateCountry
