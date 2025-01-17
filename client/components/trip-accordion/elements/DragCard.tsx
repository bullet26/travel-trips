import { useRef } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Card as AntCard } from 'antd'
import { useDrag } from 'react-dnd'
import { Card } from 'components'
import { useDropEnd, useDeleteCard } from './hooks'
import s from '../TripDaysAccordion.module.scss'

interface DragCardProps {
  type: 'up' | 'td' | 'searchResult'
  placeId: number
  isEditMode?: boolean
  dragType: string
  imgUrl?: string
  title: string
  parentCellId?: number
}

export const DragCard = (props: DragCardProps) => {
  const { type, placeId, isEditMode, dragType, imgUrl, title, parentCellId = null } = props

  const dragRef = useRef<HTMLDivElement>(null)

  const mutation = useDropEnd()
  const deleteCard = useDeleteCard()

  const [{ isDragging }, dragConnector] = useDrag(() => ({
    type: dragType,
    item: { placeId, sourceType: type, sourceId: parentCellId },
    end: (item, monitor) => {
      mutation(item, monitor.getDropResult())
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  dragConnector(dragRef)

  const isActive = isEditMode && isDragging

  const dragStyle = {
    opacity: isActive ? 0.3 : 1,
    border: isActive ? '3px solid white' : '',
    filter: isActive ? 'grayscale(100%)' : '',
  }

  const onDeleteClick = () => {
    if (parentCellId && type !== 'searchResult') {
      deleteCard({ id: parentCellId, type, placeId })
    }
  }

  return (
    <>
      {type === 'searchResult' && (
        <>
          <AntCard
            key={`${type}_${placeId}`}
            size="small"
            className={s.card}
            ref={dragRef}
            style={dragStyle}>
            <div style={{ userSelect: 'none' }}>{title}</div>
          </AntCard>
        </>
      )}
      {(type === 'up' || type === 'td') && (
        <div>
          {isEditMode && (
            <Button icon={<DeleteOutlined />} className={s.deleteBtn} onClick={onDeleteClick}>
              Delete from trip
            </Button>
          )}
          <Card
            key={`${type}_${placeId}`}
            imgUrl={imgUrl}
            title={title}
            routeHref={`/places/${placeId}`}
            style={dragStyle}
            cardRef={dragRef}
          />
        </div>
      )}
    </>
  )
}
