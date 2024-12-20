'use client'
import { useState } from 'react'
import { Card } from 'antd'
import { useTanstackQuery } from 'hooks/useTanstackQuery'
import { CountryNest } from 'types'
import s from './Countries.module.scss'
import { DeleteOutlined } from '@ant-design/icons'
import { useTanstackMutation } from 'hooks'
import { InfoMessage } from 'components'

const Countries = () => {
  const [infoMsg, setInfoMsg] = useState<string | null>(null)

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

  const onDelete = (id: number) => {
    mutation.mutate({ id })
  }

  return (
    <>
      <div className={s.wrapper}>
        {query.data?.map((item) => (
          <Card key={item.id}>
            <div className={s.card}>
              <p>{item.name}</p>
              <DeleteOutlined onClick={() => onDelete(item.id)} />
            </div>
          </Card>
        ))}
      </div>
      <InfoMessage msg={infoMsg} />
    </>
  )
}

export default Countries
