'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from 'antd'
import { useDebounce, useTanstackQuery } from 'hooks'
import { SearchNestResult } from 'types'
import SearchList from './SearchList'
import s from './Search.module.scss'

export const Search = () => {
  const { Search } = Input

  const searchRef = useRef<HTMLDivElement | null>(null)

  const [inputValue, setInputValue] = useState('')
  const [showSearchList, setShowSearchListStatus] = useState(false)
  const [searchListStyles, setSearchListStyles] = useState({ top: 0, left: 0, width: 0 })

  const debouncedValue = useDebounce(inputValue, 500)

  const { data = [], isSuccess } = useTanstackQuery<SearchNestResult>({
    url: `search?searchString=${debouncedValue}`,
    queryKey: ['search', debouncedValue],
    enabled: !!debouncedValue,
  })

  useEffect(() => {
    if (isSuccess) {
      setShowSearchListStatus(true)
    }

    if (searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect()
      setSearchListStyles({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }, [isSuccess])

  const hideSearchList = () => {
    setShowSearchListStatus(false)
    setInputValue('')
  }

  return (
    <div ref={searchRef}>
      <Search
        placeholder="Search"
        allowClear
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={s.searchInput}
      />
      {showSearchList && (
        <SearchList
          data={data}
          onClose={hideSearchList}
          style={{ top: searchListStyles.top + 10, left: searchListStyles.left }}
        />
      )}
    </div>
  )
}
