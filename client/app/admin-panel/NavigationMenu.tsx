'use client'
import { useEffect, useState } from 'react'
import { Menu, MenuProps } from 'antd'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { EditOutlined } from '@ant-design/icons'
type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  {
    key: 'create',
    label: 'Create',
    icon: <EditOutlined />,
    children: [
      { key: 'city', label: <Link href="/admin-panel/create/city">City</Link> },
      { key: 'country', label: <Link href="/admin-panel/create/country">Country</Link> },
      { key: 'place', label: <Link href="/admin-panel/create/place">Place</Link> },
      { key: 'tag', label: <Link href="/admin-panel/create/tag">Tag</Link> },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    // icon: <AppstoreOutlined />,
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '7', label: 'Option 7' },
          { key: '8', label: 'Option 8' },
        ],
      },
    ],
  },
  {
    key: 'sub4',
    label: 'Navigation Three',
    // icon: <SettingOutlined />,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
]

export const NavigationMenu = () => {
  const pathname = usePathname()
  const [current, setCurrent] = useState('')

  useEffect(() => {
    const key = pathname.split('/').at(-1) || ''
    setCurrent(key)
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
