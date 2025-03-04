'use client'

import { useRef, useEffect, CSSProperties } from 'react'
import Image from 'next/image'
import { useDrop } from 'react-dnd'
import { Spin } from 'antd'
import { useTanstackLazyQuery } from 'hooks'
import { GPS } from 'assets'
import { PlaceNest, TripDayNest, UnassignedPlacesNest, WishlistNest } from 'types'
import { openPlacesGoogleMaps } from 'utils'
import { DragCard } from './DragCard'
import s from './DnD.module.scss'

interface DropCardItemProps {
  id: number
  type: 'up' | 'td' | 'wl'
  dragType: string
  isEditMode: boolean
  style?: CSSProperties
}

export const DropCardItem = (props: DropCardItemProps) => {
  const { id, type, isEditMode, dragType, style } = props

  const [triggerTripDay, { data: tdData, isLoading: isLoadingTripDay, isError: isErrorTD }] =
    useTanstackLazyQuery<TripDayNest, number>({
      url: 'trips-day',
    })

  const [triggerUP, { data: upData, isLoading: isLoadingUp, isError: isErrorUp }] =
    useTanstackLazyQuery<UnassignedPlacesNest, number>({
      url: 'unassigned-places',
    })

  const [triggerWL, { data: wlData, isLoading: isLoadingWl, isError: isErrorWl }] =
    useTanstackLazyQuery<WishlistNest, number>({
      url: 'wishlists',
    })

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

  useEffect(() => {
    if (type === 'up') {
      triggerUP(Number(id), ['unassigned-places', `${id}`])
    } else if (type === 'td') {
      triggerTripDay(Number(id), ['trips-day', `${id}`])
    } else if (type === 'wl') {
      triggerWL(Number(id), ['wishlists', `${id}`])
    }
  }, [])

  const isActive = isEditMode && isOver && canDrop

  let isLoading
  let isError
  let places: Pick<PlaceNest, 'latitude' | 'longitude' | 'id' | 'name' | 'images'>[] | undefined

  if (type === 'up') {
    isLoading = isLoadingUp
    isError = isErrorUp
    places = upData?.places || []
  } else if (type === 'td') {
    isLoading = isLoadingTripDay
    isError = isErrorTD
    places = tdData?.places || []
  } else if (type === 'wl') {
    isLoading = isLoadingWl
    isError = isErrorWl
    places = wlData?.places || []
  }

  const dropStyle = {
    backgroundColor: `${isActive ? 'darkred' : '#141414'}`,
  }

  const isShowGM = places && places?.length

  return (
    <div ref={dropRef} className={s.dayItem} style={{ ...style, ...dropStyle }}>
      {isLoading && <Spin size="large" />}
      {isShowGM ? (
        <div className={s.gm}>
          <span className={s.gmText}>Open in Google Map</span>
          <GPS
            width={30}
            style={{ cursor: 'pointer' }}
            onClick={() => openPlacesGoogleMaps(places)}
          />
        </div>
      ) : (
        ''
      )}
      <div className={s.placeWrapper}>
        {places?.map((item) => (
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
      </div>
      {isError && <div style={{ color: '#fff' }}>Something went wrong</div>}
    </div>
  )
}
