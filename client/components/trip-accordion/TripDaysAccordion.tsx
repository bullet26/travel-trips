'use client'
import { useEffect, useState } from 'react'
import { Button, Collapse, Spin } from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  SettingOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useTanstackLazyQuery } from 'hooks'
import { Card } from 'components'
import { TripDayNest, UnassignedPlacesNest } from 'types'
import { formatToDateString } from 'utils'
import { SearchPlacePanel } from './SearchPlacePanel'
import s from './TripDaysAccordion.module.scss'

interface TripDaysAccordionProps {
  unassignedPlacesId: number
  tripDays: { id: number; date: Date }[]
}

export const TripDaysAccordion = (props: TripDaysAccordionProps) => {
  const { unassignedPlacesId, tripDays } = props

  const [isEditMode, setEditModeStatus] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [dataCache, setDataCache] = useState<Record<string, TripDayNest | UnassignedPlacesNest>>({})

  const [triggerTripDay, { data: tdData, isLoading: isLoadingTripDay, isError: isErrorTD }] =
    useTanstackLazyQuery<TripDayNest, number>({
      url: 'trips-day',
      queryKey: ['trips-day'],
    })

  const [triggerUP, { data: upData, isLoading: isLoadingUp, isError: isErrorUp }] =
    useTanstackLazyQuery<UnassignedPlacesNest, number>({
      url: 'unassigned-places',
      queryKey: ['unassigned-places'],
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

  const handlePanelChange = async (keys: string | string[]) => {
    const newKeys = Array.isArray(keys) ? keys : [keys]
    setOpenKeys(newKeys)

    const keyToLoad = newKeys.find((key) => !dataCache[key])
    if (keyToLoad) {
      const [type, id] = keyToLoad.split('_')

      if (type === 'up') {
        triggerUP(Number(id))
      }
      if (type === 'td') {
        triggerTripDay(Number(id))
      }
    }
  }

  const onEditClick = () => setEditModeStatus((prevState) => !prevState)

  const items = [
    {
      key: `up_${unassignedPlacesId}`,
      label: 'unassigned places',
      styles: { header: { border: '1px solid #252525' }, body: { border: '1px solid #252525' } },
      children: (
        <>
          {isLoadingUp && openKeys.includes(`up_${unassignedPlacesId}`) && <Spin size="large" />}
          {dataCache[`up_${unassignedPlacesId}`] &&
            JSON.stringify(dataCache[`up_${unassignedPlacesId}`])}
          {isErrorUp && <div style={{ color: '#fff' }}>Something went wrong</div>}
        </>
      ),
    },
    ...tripDays.map((item) => ({
      key: `td_${item.id}`,
      label: <div>{formatToDateString(item.date)}</div>,
      styles: { header: { border: '1px solid #252525' }, body: { border: '1px solid #252525' } },
      children: (
        <>
          {isLoadingTripDay && openKeys.includes(`td_${item.id}`) && <Spin size="large" />}
          {dataCache[`td_${item.id}`] && (
            <>
              {dataCache[`td_${item.id}`].places.map((item) => (
                <>
                  {isEditMode && (
                    <Button icon={<DeleteOutlined />} className={s.deleteBtn}>
                      Delete from trip
                    </Button>
                  )}
                  <Card
                    key={item.id}
                    imgUrl={item.images?.at(0)?.url}
                    title={item.name}
                    routeHref={`/places/${item.id}`}
                  />
                </>
              ))}
            </>
          )}
          {isErrorTD && <div style={{ color: '#fff' }}>Something went wrong</div>}
        </>
      ),
    })),
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
        {isEditMode && <SearchPlacePanel />}
      </div>
    </>
  )
}
