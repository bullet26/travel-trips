import { Input } from 'antd'
import { SearchProps } from 'antd/es/input'
import { fetcherServer } from 'api'
import s from '../../Header.module.scss'

export const Search = () => {
  const { Search } = Input

  const onSearch: SearchProps['onSearch'] = async (value, _e, info) => {
    console.log(info?.source, value)
    const res = await fetcherServer<unknown>({ url: `search?searchString=${value}` })
    console.log(res)
  }

  return <Search placeholder="Search" allowClear onSearch={onSearch} className={s.searchInput} />
}
