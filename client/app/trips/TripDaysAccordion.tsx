// import { useState } from 'react'
import { Collapse } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { useTanstackQuery } from 'hooks'
import { TripDayNest, UnassignedPlacesNest } from 'types'
import { formatToDateString } from 'utils'

const { Panel } = Collapse

interface TripDaysAccordionProps {
  unassignedPlacesId: number
  tripDays: { id: number; date: Date }[]
}

export const TripDaysAccordion = (props: TripDaysAccordionProps) => {
  const { unassignedPlacesId, tripDays } = props

  // const [openKeys, setOpenKeys] = useState<string | string[]>([])
  // const [data, setData] = useState({})

  const { data: tripDay } = useTanstackQuery<TripDayNest>({
    url: 'trips-day',
    queryKey: ['trips-day'],
    id: tripDays[0].id,
  })

  console.log(tripDay)

  const { data: up } = useTanstackQuery<UnassignedPlacesNest>({
    url: 'unassigned-places',
    queryKey: ['unassigned-places'],
    id: unassignedPlacesId,
  })

  console.log(up)

  return (
    <Collapse
      size="large"
      ghost
      expandIconPosition="end"
      expandIcon={({ isActive }) => (isActive ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
      style={{ backgroundColor: '#141414' }}>
      <Panel header="unassigned places" key={unassignedPlacesId}>
        <p>ldvk vhmikm j0.kp</p>
      </Panel>
      {tripDays.map((item) => (
        <Panel
          style={{ border: '1px solid #252525' }}
          header={formatToDateString(item.date)}
          key={item.id}>
          <p>ldvk vhmikm j0.kp</p>
        </Panel>
      ))}
    </Collapse>
  )
}
