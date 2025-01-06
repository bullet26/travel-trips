import { FC } from 'react'
import { useRouter } from 'next/navigation'
import { type SearchType } from 'types'
import { crateLink } from './utils'
import s from './Search.module.scss'

interface SearchCardProps {
  title: string
  id?: number
  type?: SearchType
  onClick: () => void
}

const SearchCard: FC<SearchCardProps> = (props) => {
  const { title, onClick, type = '', id = 0 } = props

  const router = useRouter()

  const onClickLink = () => {
    onClick()
    if (type && id) router.push(crateLink(id, type))
  }

  return (
    <div className={s.card} onClick={onClickLink}>
      {title}
    </div>
  )
}

export default SearchCard
