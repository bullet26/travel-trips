import { FC, useRef, useEffect, CSSProperties } from 'react'
import { SearchNestResult } from 'types'
import SearchCard from './SearchCard'
import s from './Search.module.scss'

interface SearchListProps {
  data: SearchNestResult
  style?: CSSProperties
  onClose: () => void
}

const SearchList: FC<SearchListProps> = (props) => {
  const { data, onClose, style } = props

  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | Event) => {
      if (e.target === listRef?.current || window.scrollY > 20) {
        onClose()
      }
    }
    window.addEventListener('click', handleClickOutside)
    window.addEventListener('scroll', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <>
      <div className={s.wrapper} ref={listRef}>
        <div className={s.cardList} style={style}>
          {data.map((item) => (
            <SearchCard
              key={item.id}
              id={item.id}
              title={item.name}
              type={item.type}
              onClick={onClose}
            />
          ))}
          {!data.length && <SearchCard title="Couldn't find anything" onClick={onClose} />}
        </div>
      </div>
    </>
  )
}

export default SearchList
