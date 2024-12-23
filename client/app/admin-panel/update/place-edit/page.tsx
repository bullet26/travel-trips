'use client'
import { useState } from 'react'
import { Button, Card, Divider, Drawer, Tabs } from 'antd'
import { useTanstackQuery } from 'hooks/useTanstackQuery'
import { CountryNest, PlaceNest } from 'types'
import { DeleteOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { useTanstackMutation } from 'hooks'
import { InfoMessage, PlaceForm } from 'components'
import s from '../Update.module.scss'

const Places = () => {
  const [infoMsg, setInfoMsg] = useState<string | null>(null)
  const [openDrawer, setDrawerStatus] = useState(false)
  const [itemId, setItemId] = useState<null | number>(null)
  const [countryId, setICountryId] = useState<null | number>(null)
  const [cityId, setICityId] = useState<null | number>(null)
  const [initialValues, setInitialValues] = useState<undefined | PlaceNest>(undefined)

  const query = useTanstackQuery<PlaceNest[]>({ url: 'places', queryKey: ['places'] })

  const queryCountries = useTanstackQuery<CountryNest[]>({
    url: 'countries',
    queryKey: ['countries'],
  })

  const mutation = useTanstackMutation<{ message: string }>({
    url: 'places',
    method: 'DELETE',
    queryKey: ['places'],
    onSuccess: (data) => {
      if (data) {
        setInfoMsg(data.message)
      }
    },
  })

  const onEdit = (id: number) => {
    setDrawerStatus(true)
    setItemId(id)
    const values = query.data?.find((item) => item.id === id)
    setInitialValues(values)
  }

  const onDelete = (id: number) => {
    mutation.mutate({ id })
  }

  const onClose = () => {
    setDrawerStatus(false)
    setItemId(null)
  }

  return (
    <>
      <Tabs
        type="card"
        items={[
          {
            label: `All places list`,
            key: 'all',
            children: (
              <div className={s.wrapper}>
                {query.data?.map((item) => (
                  <Card key={item.id}>
                    <div className={s.card} onClick={() => onEdit(item.id)}>
                      <p>{item.name}</p>
                      <DeleteOutlined onClick={() => onDelete(item.id)} />
                    </div>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            label: `Group by country`,
            key: 'group',
            children: (
              <>
                <div className={s.wrapper}>
                  {queryCountries.data?.map((item) => (
                    <Button
                      key={item.id}
                      className={clsx({ [s.active]: item.id === countryId })}
                      onClick={() => setICountryId(item.id)}>
                      <div className={s.card}>
                        <p>{item.name}</p>
                      </div>
                    </Button>
                  ))}
                </div>
                <Divider />
                <div className={s.wrapper}>
                  {queryCountries.data
                    ?.find(({ id }) => id === countryId)
                    ?.cities?.map((item) => (
                      <Button
                        key={item.id}
                        className={clsx({ [s.active]: item.id === cityId })}
                        onClick={() => setICityId(item.id)}>
                        <div className={s.card}>
                          <p>{item.name}</p>
                        </div>
                      </Button>
                    ))}
                </div>
                <Divider />
                <div className={s.wrapper}>
                  {query.data
                    ?.filter((item) => item.cityId === cityId)
                    ?.map((item) => (
                      <Card key={item.id}>
                        <div className={s.card}>
                          <p onClick={() => onEdit(item.id)}>{item.name}</p>
                          <DeleteOutlined onClick={() => onDelete(item.id)} />
                        </div>
                      </Card>
                    ))}
                </div>
              </>
            ),
          },
        ]}
      />

      <Drawer title="Update city" onClose={onClose} open={openDrawer} width={800} destroyOnClose>
        <PlaceForm mode="update" id={itemId} initialValues={initialValues} onSuccess={onClose} />
      </Drawer>
      <InfoMessage msg={infoMsg} />
    </>
  )
}

export default Places
