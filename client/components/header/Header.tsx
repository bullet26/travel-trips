'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getCookie } from 'cookies-next/client'
import Image from 'next/image'
import { Button } from 'antd'
import { gothicCastle } from 'assets'
import { RoleType } from 'types'
import { Search, Profile } from './elements'
import s from './Header.module.scss'

export const Header = () => {
  const pathname = usePathname()

  const [role, setRole] = useState<RoleType | null>(null)

  useEffect(() => {
    setRole(getCookie('role') as RoleType)
  }, [])

  const noHeaderRoutes = ['/login', '/registration']
  const showHeader = pathname && !noHeaderRoutes.includes(pathname)

  return showHeader && role ? (
    <header className={s.wrapper}>
      <Link key="Dashboard" href="/dashboard">
        <Image src={gothicCastle} height={55} alt="Picture of the city" />
      </Link>
      <div className={s.innerWrapper}>
        <Link key="Countries" href="/countries">
          <Button type="text" className={s.menuItem}>
            Countries
          </Button>
        </Link>

        {role === RoleType.ADMIN && (
          <Link key="Admin panel" href="/admin-panel">
            <Button type="text" className={s.menuItem}>
              Admin panel
            </Button>
          </Link>
        )}
        <Search />
        <div className={s.userWrapper}>
          <Link key="My trips" href="/trips">
            <Button type="text" className={s.menuItem}>
              My trips
            </Button>
          </Link>
          <Link key="My wishlists" href="/wishlists">
            <Button type="text" className={s.menuItem}>
              My wishlists
            </Button>
          </Link>
          <Profile />
        </div>
      </div>
    </header>
  ) : (
    <span></span>
  )
}
