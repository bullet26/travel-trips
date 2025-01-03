'use client'
import { useEffect, useState } from 'react'
import { Button, Card, Divider, Drawer, Tabs } from 'antd'
import { useTanstackQuery } from 'hooks/useTanstackQuery'
import { CityNest, CountryNest, ICreateCity, ImageAttributesNest } from 'types'
import { DeleteOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { useContextActions, useTanstackMutation } from 'hooks'
import { CityForm } from 'components'
import s from '../Update.module.scss'

const Cities = () => {
  const [openDrawer, setDrawerStatus] = useState(false)
  const [itemId, setItemId] = useState<null | number>(null)
  const [countryId, setICountryId] = useState<null | number>(null)
  const [initialValues, setInitialValues] = useState<undefined | ICreateCity>(undefined)
  const [images, setImages] = useState<undefined | ImageAttributesNest[]>(undefined)

  const { setInfoMsg, setErrorMsg } = useContextActions()

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

  useEffect(() => {
    if (mutation.error?.message) setErrorMsg(mutation.error?.message)
  }, [mutation.error?.message])

  const onEdit = (id: number) => {
    setDrawerStatus(true)
    setItemId(id)
    const values = query.data?.find((item) => item.id === id)

    if (values) {
      const { countryId, name, latitude, longitude, images, translations } = values
      setInitialValues({ countryId, name, latitude, longitude, translations })
      setImages(images)
    }
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
                    <div className={s.card}>
                      <p onClick={() => onEdit(item.id)}>{item.name}</p>
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
        <CityForm
          mode="update"
          id={itemId}
          initialValues={initialValues}
          images={images}
          onSuccess={onClose}
        />
      </Drawer>
    </>
  )
}

export default Cities
