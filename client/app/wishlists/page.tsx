'use client'

import { Button } from 'antd'
import Link from 'next/link'
import s from './Wishlists.module.scss'

const Wishlists = () => {
  return (
    <div>
      <Link href="/wishlists/create">
        <Button type="primary" className={s.mainBtn}>
          Create new wishlist
        </Button>
      </Link>
    </div>
  )
}

export default Wishlists
