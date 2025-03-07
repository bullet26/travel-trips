'use client'
import { useEffect, useState } from 'react'
import { Drawer } from 'antd'
import { useTanstackQuery } from 'hooks/useTanstackQuery'
import { CountryNest, ICreateCountry, ImageAttributesNest } from 'types'
import { useContextActions, useTanstackMutation } from 'hooks'
import { CardWithDelete, CountryForm } from 'components'
import s from '../Update.module.scss'

const Countries = () => {
  const [openDrawer, setDrawerStatus] = useState(false)
  const [itemId, setItemId] = useState<null | number>(null)
  const [initialValues, setInitialValues] = useState<undefined | ICreateCountry>(undefined)
  const [images, setImages] = useState<undefined | ImageAttributesNest[]>(undefined)

  const { setInfoMsg, setErrorMsg } = useContextActions()

  const query = useTanstackQuery<CountryNest[]>({ url: 'countries', queryKey: ['countries'] })

  const mutation = useTanstackMutation<{ message: string }>({
    url: 'countries',
    method: 'DELETE',
    queryKey: ['countries'],
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
      const { name, latitude, longitude, images, translations } = values
      setInitialValues({ name, latitude, longitude, translations })
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
      <div className={s.wrapper}>
        {query.data?.map((item) => (
          <CardWithDelete
            key={item.id}
            id={item.id}
            title={item.name}
            entity="country"
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <Drawer title="Update country" onClose={onClose} open={openDrawer} width={800} destroyOnClose>
        <CountryForm
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

export default Countries
