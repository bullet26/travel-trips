'use client'
import { useEffect, useState } from 'react'
import { Menu, MenuProps } from 'antd'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { EditOutlined, FileAddOutlined, PictureOutlined } from '@ant-design/icons'
type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    key: 'create',
    label: 'Create',
    icon: <FileAddOutlined />,
    children: [
      { key: 'city', label: <Link href="/admin-panel/create/city">City</Link> },
      { key: 'country', label: <Link href="/admin-panel/create/country">Country</Link> },
      { key: 'place', label: <Link href="/admin-panel/create/place">Place</Link> },
      { key: 'tag', label: <Link href="/admin-panel/create/tag">Tag</Link> },
    ],
  },
  {
    key: 'update',
    label: 'Update info',
    icon: <EditOutlined />,
    children: [
      { key: 'city-edit', label: <Link href="/admin-panel/update/cities">City</Link> },
      { key: 'country-edit', label: <Link href="/admin-panel/update/countries">Country</Link> },
      { key: 'place-edit', label: <Link href="/admin-panel/update/places">Place</Link> },
      { key: 'tag-edit', label: <Link href="/admin-panel/update/tags">Tag</Link> },
    ],
  },
  {
    key: 'images',
    label: 'Images',
    icon: <PictureOutlined />,
    children: [
      { key: 'upload', label: <Link href="/admin-panel/images-edit/upload">Upload</Link> },
      {
        key: 'all',
        label: <Link href="/admin-panel/images-edit/all">All: update and delete</Link>,
      },
    ],
  },
]

export const NavigationMenu = () => {
  const pathname = usePathname()
  const [current, setCurrent] = useState('')

  useEffect(() => {
    const key = pathname.split('/').at(-1) || ''
    setCurrent(key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
  }

  return (
    <Menu
      theme="dark"
      onClick={onClick}
      style={{ width: 256 }}
      defaultOpenKeys={['create']}
      selectedKeys={[current]}
      mode="inline"
      items={items}
    />
  )
}
