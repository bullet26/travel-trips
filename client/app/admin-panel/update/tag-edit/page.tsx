'use client'
import { useState } from 'react'
import { Drawer, Tag } from 'antd'
import { useTanstackQuery } from 'hooks/useTanstackQuery'
import { TagNest, ICreateTag } from 'types'
import { DeleteOutlined } from '@ant-design/icons'
import { useTanstackMutation } from 'hooks'
import { TagForm, InfoMessage } from 'components'
import s from '../Update.module.scss'

const Tags = () => {
  const [infoMsg, setInfoMsg] = useState<string | null>(null)
  const [openDrawer, setDrawerStatus] = useState(false)
  const [itemId, setItemId] = useState<null | number>(null)
  const [initialValues, setInitialValues] = useState<undefined | ICreateTag>(undefined)

  const query = useTanstackQuery<TagNest[]>({ url: 'tags', queryKey: ['tags'] })

  const mutation = useTanstackMutation<{ message: string }>({
    url: 'tags',
    method: 'DELETE',
    queryKey: ['tags'],
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
      <div className={s.wrapper}>
        {query.data?.map(({ id, name }) => (
          <Tag key={id} color="red" bordered={false} className={s.card}>
            <div className={s.card}>
              <div onClick={() => onEdit(id)}>#{name}</div>
              <DeleteOutlined onClick={() => onDelete(id)} />
            </div>
          </Tag>
        ))}
      </div>
      <Drawer title="Update tag" onClose={onClose} open={openDrawer} width={800} destroyOnClose>
        <TagForm mode="update" id={itemId} initialValues={initialValues} onSuccess={onClose} />
      </Drawer>
      <InfoMessage msg={infoMsg} />
    </>
  )
}

export default Tags
