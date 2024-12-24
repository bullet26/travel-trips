import { CSSProperties, FC } from 'react'
import Image from 'next/image'
import { DeleteOutlined } from '@ant-design/icons'
import { useTanstackMutation } from 'hooks'
import s from './ImageIEdited.module.scss'
import { EntityType } from 'types'

interface ImageIEditedProps {
  size: 'small' | 'big'
  style?: CSSProperties
  id: number
  url: string
  entityId?: number
  entityType?: EntityType
  onSuccess?: () => void
  additionalQueryKey?: string
}

export const ImageIEdited: FC<ImageIEditedProps> = (props) => {
  const { entityType, entityId, id, url, size, style, onSuccess, additionalQueryKey } = props

  const queryKey = ['images']
  if (additionalQueryKey) {
    queryKey.push(additionalQueryKey)
  }

  const mutation = useTanstackMutation<{ message: string }>({
    url: 'images',
    method: 'DELETE',
    queryKey,
    onSuccess: () => {
      if (onSuccess) onSuccess()
    },
  })

  const onDelete = (id: number) => {
    mutation.mutate({ id })
  }

  const width = size === 'big' ? 200 : 70
  const height = size === 'big' ? 200 : 70

  return (
    <div className={s.wrapper} style={style}>
      <Image
        key={id}
        src={url}
        width={width}
        height={height}
        alt={`Picture of the ${entityType}`}
      />
      <div className={s.imageItem} style={{ width: width }}>
        <span>
          {entityType}, {entityId}
        </span>
        <DeleteOutlined onClick={() => onDelete(id)} />
      </div>
    </div>
  )
}
