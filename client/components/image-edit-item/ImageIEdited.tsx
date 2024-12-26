import { CSSProperties, FC } from 'react'
import Image from 'next/image'
import { DeleteOutlined } from '@ant-design/icons'
import { useContextActions, useTanstackMutation } from 'hooks'
import { EntityType } from 'types'
import s from './ImageIEdited.module.scss'

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

  const { setInfoMsg } = useContextActions()

  const queryKey = ['images']
  if (additionalQueryKey) {
    queryKey.push(additionalQueryKey)
  }

  const mutation = useTanstackMutation<{ message: string }>({
    url: 'images',
    method: 'DELETE',
    queryKey,
    onSuccess: (data) => {
      if (onSuccess) onSuccess()
      if (data) setInfoMsg(data.message)
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
        className={s.image}
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
