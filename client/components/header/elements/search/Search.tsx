import { Input } from 'antd'
import { SearchProps } from 'antd/es/input'
import s from '../../Header.module.scss'

export const Search = () => {
  const { Search } = Input

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value)

  return <Search placeholder="Search" allowClear onSearch={onSearch} className={s.searchInput} />
}
