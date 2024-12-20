'use client'
import { useState } from 'react'
import { Button, Card, Divider, Drawer, Tabs } from 'antd'
import { useTanstackQuery } from 'hooks/useTanstackQuery'
import { CityNest, CountryNest, ICreateCity } from 'types'
import { DeleteOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { useTanstackMutation } from 'hooks'
import { CityForm, InfoMessage } from 'components'
import s from '../Update.module.scss'

const Cities = () => {
  const [infoMsg, setInfoMsg] = useState<string | null>(null)
  const [openDrawer, setDrawerStatus] = useState(false)
  const [itemId, setItemId] = useState<null | number>(null)
  const [countryId, setICountryId] = useState<null | number>(null)
  const [initialValues, setInitialValues] = useState<undefined | ICreateCity>(undefined)

  const query = useTanstackQuery<CityNest[]>({ url: 'cities', queryKey: ['cities'] })

  const queryCountries = useTanstackQuery<CountryNest[]>({
    url: 'countries',
    queryKey: ['countries'],
  })

  const mutation = useTanstackMutation<{ message: string }>({
    url: 'cities',
    method: 'DELETE',
    queryKey: ['cities'],
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
            label: `All city list`,
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
                      <Card key={item.id}>
                        <div className={s.card} onClick={() => onEdit(item.id)}>
                          <p>{item.name}</p>
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

      <Drawer title="Update city" onClose={onClose} open={openDrawer} width={500} destroyOnClose>
        <CityForm mode="update" id={itemId} initialValues={initialValues} onSuccess={onClose} />
      </Drawer>
      <InfoMessage msg={infoMsg} />
    </>
  )
}

export default Cities
