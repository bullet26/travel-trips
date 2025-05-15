import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Dropdown, MenuProps } from 'antd'
import { getCookie, deleteCookie } from 'cookies-next/client'
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import s from '../../Header.module.scss'

export const Profile = () => {
  const [name, setName] = useState<string | null>()
  const [email, setEmail] = useState<string | null>()

  const router = useRouter()

  useEffect(() => {
    const name = getCookie('name')
    const email = getCookie('email')

    if (name) setName(name)
    if (email) setEmail(email)
  }, [])

  const logout = () => {
    deleteCookie('accessToken')
    deleteCookie('refreshToken')
    deleteCookie('name')
    router.push('/login')
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: email || 'email',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: (
        <Link key="Account Settings" href="/profile-settings">
          Account Settings
        </Link>
      ),
      icon: <SettingOutlined />,
    },
    {
      key: '3',
      label: <div onClick={logout}>Log out</div>,
      icon: <LogoutOutlined />,
    },
  ]

  return (
    <Dropdown menu={{ items }} placement="bottom">
      <Button type="text" className={s.name}>
        {name}
      </Button>
    </Dropdown>
  )
}
