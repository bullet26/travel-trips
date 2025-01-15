import { useState } from 'react'
import { Card, Input } from 'antd'
import { useDebounce, useTanstackQuery } from 'hooks'
import { SearchPlaceNestResult } from 'types'
import s from './TripDaysAccordion.module.scss'

export const SearchPlacePanel = () => {
  const { Search } = Input

  const [inputValue, setInputValue] = useState('')

  const debouncedValue = useDebounce(inputValue, 500)

  const { data = [], isSuccess } = useTanstackQuery<SearchPlaceNestResult>({
    url: `search/places?searchString=${debouncedValue}`,
    queryKey: ['search/places', debouncedValue],
    enabled: !!debouncedValue,
  })

  return (
    <div className={s.searchWrapper}>
      <Search
        placeholder="Search"
        allowClear
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={s.searchInput}
      />
      <div className={s.cardWrapper}>
        {data.map((item) => (
          <Card key={item.id} size="small" className={s.card}>
            <div>{item.name}</div>
          </Card>
        ))}
        {isSuccess && !data.length && (
          <Card key={0} size="small">
            <div>Couldn&apos;t find anything</div>
          </Card>
        )}
      </div>
    </div>
  )
}
