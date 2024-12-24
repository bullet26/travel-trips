'use client'
import { useEffect, useState } from 'react'
import { Menu, MenuProps } from 'antd'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { EditOutlined, FileAddOutlined, PictureOutlined } from '@ant-design/icons'
type MenuItem = Required<MenuProps>['items'][number]

export const NavigationMenu = () => {
  const pathname = usePathname()
  const [currentKeys, setCurrentKeys] = useState<string[]>([])

  useEffect(() => {
    const [, , ...keys] = pathname.split('/')
    setCurrentKeys(keys)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrentKeys((prevState) => [prevState[0], e.key])
  }

  const onTitleClick = ({ key }: { key: string }) => {
    setCurrentKeys((prevState) => {
      if (key === prevState[0]) return ['', prevState[1]]
      return [key, prevState[1]]
    })
  }

  const items: MenuItem[] = [
    {
      key: 'create',
      label: 'Create',
      icon: <FileAddOutlined />,
      onTitleClick,
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
      onTitleClick,
      children: [
        { key: 'city-edit', label: <Link href="/admin-panel/update/city-edit">City</Link> },
        {
          key: 'country-edit',
          label: <Link href="/admin-panel/update/country-edit">Country</Link>,
        },
        { key: 'place-edit', label: <Link href="/admin-panel/update/place-edit">Place</Link> },
        { key: 'tag-edit', label: <Link href="/admin-panel/update/tag-edit">Tag</Link> },
      ],
    },
    {
      key: 'images-edit',
      label: 'Images',
      icon: <PictureOutlined />,
      onTitleClick,
      children: [
        {
          key: 'all',
          label: <Link href="/admin-panel/images-edit/all">All: update and delete</Link>,
        },
      ],
    },
  ]

  return (
    <Menu
      theme="dark"
      onClick={onClick}
      style={{ width: 256 }}
      defaultOpenKeys={['create']}
      openKeys={currentKeys}
      selectedKeys={currentKeys}
      mode="inline"
      items={items}
    />
  )
}
