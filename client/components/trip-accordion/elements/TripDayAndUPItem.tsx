import { useRef } from 'react'
import { useDrop } from 'react-dnd'
import { Spin } from 'antd'
import { PlaceNest } from 'types'
import { DragCard } from './DragCard'
import s from '../TripDaysAccordion.module.scss'

interface TripDayAndUPItem {
  id: number
  type: 'up' | 'td'
  dragType: string
  isLoading: boolean
  isError: boolean
  places: Pick<PlaceNest, 'id' | 'name' | 'images'>[]
  isEditMode: boolean
}

export const TripDayAndUPItem = (props: TripDayAndUPItem) => {
  const { id, type, isLoading, isError, places, isEditMode, dragType } = props

  const dropRef = useRef<HTMLDivElement>(null)

  const [{ canDrop, isOver }, dropConnector] = useDrop(() => ({
    accept: dragType,
    drop: () => ({ targetId: id, targetType: type }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  dropConnector(dropRef)

  const isActive = isEditMode && isOver && canDrop

  const dropStyle = {
    backgroundColor: `${isActive ? 'darkred' : '#141414'}`,
  }

  return (
    <div ref={dropRef} className={s.dayItem} style={dropStyle}>
      {isLoading && <Spin size="large" />}
      {places.map((item) => (
        <DragCard
          key={`place-${type}-${item.id}`}
          type={type}
          placeId={item.id}
          isEditMode={isEditMode}
          dragType={dragType}
          title={item.name}
          imgUrl={item?.images?.at(0)?.url}
          parentCellId={id}
          {...item}
        />
      ))}
      {isError && <div style={{ color: '#fff' }}>Something went wrong</div>}
    </div>
  )
}
