import { TagForm } from 'components'
import s from '../Create.module.scss'

const CreateTag = () => {
  return (
    <div>
      <div className={s.title}>Create new tag</div>
      <TagForm mode="crete" />
    </div>
  )
}

export default CreateTag
