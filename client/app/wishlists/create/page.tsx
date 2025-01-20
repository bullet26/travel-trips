'use client'

import { useRouter } from 'next/navigation'
import { WishlistForm } from 'components'
import s from '../Wishlists.module.scss'

const CreateWishlist = () => {
  const router = useRouter()
  const onSuccess = () => router.push('/wishlists')

  return (
    <div>
      <div className={s.title}>Create new wishlist</div>
      <WishlistForm mode="create" onSuccess={onSuccess} />
    </div>
  )
}

export default CreateWishlist
