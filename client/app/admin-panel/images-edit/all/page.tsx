'use client'

import { useTanstackQuery } from 'hooks'
import { ImageNest } from 'types'
import { ImageIEdited } from 'components'
import s from '../../update/Update.module.scss'

const EditAndDeleteImg = () => {
  const queryImages = useTanstackQuery<ImageNest[]>({
    url: 'images',
    queryKey: ['images'],
  })

  return (
    <div className={s.wrapper}>
      {queryImages.data?.map((item) => (
        <ImageIEdited size="big" {...item} />
      ))}
    </div>
  )
}

export default EditAndDeleteImg
