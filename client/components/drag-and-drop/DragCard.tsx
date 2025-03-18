'use client'

import { useRef } from 'react'
import { DeleteOutlined, ScissorOutlined } from '@ant-design/icons'
import { Button, Card as AntCard } from 'antd'
import { useDrag } from 'react-dnd'
import { Card } from 'components'
import { useAccordionContextActions, useAccordionContextValues } from 'hooks'
import { useDropEnd, useDeleteCard } from './hooks'
import s from './DnD.module.scss'

interface DragCardProps {
  type: 'up' | 'td' | 'wl' | 'searchResult'
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

  const { setCutPlace } = useAccordionContextActions()
  const { cutPlace } = useAccordionContextValues()

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

  const isActive = (isEditMode && isDragging) || (isEditMode && cutPlace?.placeId === placeId)

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

  const onCutClick = () => {
    setCutPlace({ placeId, sourceType: type, sourceId: parentCellId })
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
      {(type === 'up' || type === 'td' || type === 'wl') && (
        <div>
          {isEditMode && (
            <div className={s.btnWrapper}>
              <Button icon={<DeleteOutlined />} className={s.deleteBtn} onClick={onDeleteClick} />

              {(type === 'up' || type === 'td') && (
                <Button icon={<ScissorOutlined />} className={s.deleteBtn} onClick={onCutClick} />
              )}
            </div>
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
