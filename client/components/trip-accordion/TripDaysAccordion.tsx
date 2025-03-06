'use client'
import { useState } from 'react'
import { Button, Collapse, Radio, RadioChangeEvent } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, SettingOutlined } from '@ant-design/icons'
import { formatToDateString } from 'utils'
import { DropCardItem, SearchPlacePanel } from 'components'
import s from './TripDaysAccordion.module.scss'
import { PlacesFromCity } from './elements'

interface TripDaysAccordionProps {
  unassignedPlacesId: number
  tripDays: { id: number; date: Date }[]
}

export const TripDaysAccordion = (props: TripDaysAccordionProps) => {
  const { unassignedPlacesId, tripDays } = props

  const dragType = 'trip'

  const [isEditMode, setEditModeStatus] = useState(false)
  const [addSource, setSource] = useState<'search' | 'city'>('search')

  const onEditClick = () => setEditModeStatus((prevState) => !prevState)

  const onChangeRadio = (e: RadioChangeEvent) => {
    setSource(e.target.value)
  }

  const items = [
    {
      key: `up_${unassignedPlacesId}`,
      label: 'unassigned places',
      styles: { header: { border: '1px solid #252525' }, body: { border: '1px solid #252525' } },
      children: (
        <DropCardItem
          id={unassignedPlacesId}
          type="up"
          dragType={dragType}
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
          <DropCardItem id={item.id} type="td" dragType={dragType} isEditMode={isEditMode} />
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
          ghost
          expandIconPosition="end"
          expandIcon={({ isActive }) => (isActive ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
          style={{ backgroundColor: '#141414', flex: 1 }}
        />
        {isEditMode && (
          <div className={s.addWrapper}>
            <Radio.Group
              value={addSource}
              onChange={onChangeRadio}
              options={[
                { value: 'search', label: 'Search' },
                { value: 'city', label: 'All places in city' },
              ]}
            />
            {addSource === 'search' && <SearchPlacePanel dragType={dragType} />}
            {addSource === 'city' && <PlacesFromCity dragType={dragType} />}
          </div>
        )}
      </div>
    </>
  )
}
