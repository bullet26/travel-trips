'use client'

import { useEffect } from 'react'
import { Button } from 'antd'
import { useTanstackLazyQuery, useTanstackQuery } from 'hooks'
import Link from 'next/link'
import { UserNestInfo, WishlistNest } from 'types'
import { Card } from 'components'
import s from './Wishlists.module.scss'

const Wishlists = () => {
  const { data: user } = useTanstackQuery<UserNestInfo>({
    url: 'users/me',
    queryKey: ['users'],
  })

  const [trigger, { data: wishlists }] = useTanstackLazyQuery<WishlistNest[], number>({
    url: 'wishlists/user',
    queryKey: ['wishlists'],
  })

  useEffect(() => {
    if (user?.userId) {
      trigger(user.userId)
    }
  }, [user?.userId])

  return (
    <div>
      <Link href="/wishlists/create">
        <Button type="primary" className={s.mainBtn}>
          Create new wishlist
        </Button>
      </Link>
      <div className={s.wishlistsWrapper}>
        {wishlists?.map((item) => (
          <Link href={`/wishlists/${item.id}`} key={item.id}>
            <Button type="text">{item.title}</Button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Wishlists
