'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getCookie } from 'cookies-next/client'
import Image from 'next/image'
import { Button } from 'antd'
import clsx from 'clsx'
import { gothicCastle } from 'assets'
import { RoleType } from 'types'
import { Search } from 'components'
import { Profile } from './elements'
import s from './Header.module.scss'

export const Header = () => {
  const pathname = usePathname()

  const [role, setRole] = useState<RoleType | null | undefined>(undefined)

  useEffect(() => {
    const role = (getCookie('role') as RoleType) || null
    setRole(role)
  }, [])

  const noHeaderPaths = ['login', 'registration']
  const showHeader =
    !!pathname && !noHeaderPaths.some((item) => new RegExp(item, 'i').test(pathname))

  const isAuth = !!role
  const isAdmin = role === RoleType.ADMIN

  return showHeader ? (
    <header className={s.wrapper}>
      {role !== undefined && (
        <>
          {isAuth && (
            <Link key="Dashboard" href="/">
              <Image src={gothicCastle} height={55} alt="Picture of the city" />
            </Link>
          )}

          <div className={s.innerWrapper}>
            <Link key="Countries" href="/countries">
              <Button
                type="text"
                className={clsx(s.menuItem, { [s.activeMenu]: pathname.includes('countries') })}>
                Countries
              </Button>
            </Link>

            {isAdmin && (
              <Link key="Admin panel" href="/admin-panel/create/place">
                <Button
                  type="text"
                  className={clsx(s.menuItem, {
                    [s.activeMenu]: pathname.includes('admin-panel'),
                  })}>
                  Admin panel
                </Button>
              </Link>
            )}

            <Search />

            {isAuth && (
              <>
                <Link key="Maps" href="/maps">
                  <Button
                    type="text"
                    className={clsx(s.menuItem, { [s.activeMenu]: pathname.includes('maps') })}>
                    Maps
                  </Button>
                </Link>
                <div className={s.userWrapper}>
                  <Link key="My trips" href="/trips">
                    <Button
                      type="text"
                      className={clsx(s.menuItem, { [s.activeMenu]: pathname.includes('trips') })}>
                      My trips
                    </Button>
                  </Link>
                  <Link key="My wishlists" href="/wishlists">
                    <Button
                      type="text"
                      className={clsx(s.menuItem, {
                        [s.activeMenu]: pathname.includes('wishlists'),
                      })}>
                      My wishlists
                    </Button>
                  </Link>
                  <Profile />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </header>
  ) : (
    <span></span>
  )
}
