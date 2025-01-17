'use client'
import { useEffect, useState } from 'react'
import { Button, Collapse } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, SettingOutlined } from '@ant-design/icons'
import { useTanstackLazyQuery } from 'hooks'
import { TripDayNest, UnassignedPlacesNest } from 'types'
import { formatToDateString } from 'utils'
import { TripDayAndUPItem, SearchPlacePanel } from './elements'
import s from './TripDaysAccordion.module.scss'

interface TripDaysAccordionProps {
  unassignedPlacesId: number
  tripDays: { id: number; date: Date }[]
}

export const TripDaysAccordion = (props: TripDaysAccordionProps) => {
  const { unassignedPlacesId, tripDays } = props

  const dragType = 'trip'

  const [isEditMode, setEditModeStatus] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [dataCache, setDataCache] = useState<Record<string, TripDayNest | UnassignedPlacesNest>>({})

  const [triggerTripDay, { data: tdData, isLoading: isLoadingTripDay, isError: isErrorTD }] =
    useTanstackLazyQuery<TripDayNest, number>({
      url: 'trips-day',
    })

  const [triggerUP, { data: upData, isLoading: isLoadingUp, isError: isErrorUp }] =
    useTanstackLazyQuery<UnassignedPlacesNest, number>({
      url: 'unassigned-places',
    })

  useEffect(() => {
    if (upData) {
      const key = `up_${unassignedPlacesId}`
      setDataCache((prev) => ({ ...prev, [key]: upData }))
    }
  }, [upData, unassignedPlacesId])

  useEffect(() => {
    if (tdData) {
      const key = `td_${tdData.id}`
      setDataCache((prev) => ({ ...prev, [key]: tdData }))
    }
  }, [tdData])

  const updateData = (keyToLoad: string) => {
    const [type, id] = keyToLoad.split('_')

    if (type === 'up') {
      triggerUP(Number(id), ['unassigned-places', `${id}`])
    }
    if (type === 'td') {
      triggerTripDay(Number(id), ['trips-day', `${id}`])
    }
  }

  const handlePanelChange = async (keys: string | string[]) => {
    const allKeys = Array.isArray(keys) ? keys : [keys]
    setOpenKeys(allKeys)

    if (isEditMode) {
      allKeys.forEach((item) => updateData(item))
    } else {
      const keyToLoad = allKeys.find((key) => !dataCache[key])
      if (!keyToLoad) return
      updateData(keyToLoad)
    }
  }

  const onEditClick = () => setEditModeStatus((prevState) => !prevState)

  const items = [
    {
      key: `up_${unassignedPlacesId}`,
      label: 'unassigned places',
      styles: { header: { border: '1px solid #252525' }, body: { border: '1px solid #252525' } },
      children: (
        <TripDayAndUPItem
          id={unassignedPlacesId}
          type="up"
          dragType={dragType}
          isLoading={isLoadingUp && openKeys.includes(`up_${unassignedPlacesId}`)}
          isError={isErrorUp}
          places={dataCache[`up_${unassignedPlacesId}`]?.places || []}
          isEditMode={isEditMode}
        />
      ),
    },
    ...tripDays.map((item) => {
      return {
        key: `td_${item.id}`,
        label: <div>{formatToDateString(item.date)}</div>,
        styles: { header: { border: '1px solid #252525' }, body: { border: '1px solid #252525' } },
        children: (
          <TripDayAndUPItem
            id={item.id}
            type="td"
            dragType={dragType}
            isLoading={isLoadingTripDay && openKeys.includes(`td_${item.id}`)}
            isError={isErrorTD}
            places={dataCache[`td_${item.id}`]?.places || []}
            isEditMode={isEditMode}
          />
        ),
      }
    }),
  ]

  return (
    <>
      <div className={s.settingBtnWrapper}>
        <Button
          type={isEditMode ? 'primary' : 'text'}
          icon={<SettingOutlined />}
          onClick={onEditClick}
        />
      </div>
      <div className={s.accordionWrapper}>
        <Collapse
          items={items}
          size="large"
          onChange={handlePanelChange}
          ghost
          expandIconPosition="end"
          expandIcon={({ isActive }) => (isActive ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
          style={{ backgroundColor: '#141414', flex: 1 }}
        />
        {isEditMode && <SearchPlacePanel dragType={dragType} />}
      </div>
    </>
  )
}
