'use client'
import { useEffect, useState } from 'react'
import { Button, Drawer, Popconfirm } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { useTanstackQuery, useTanstackMutation, useContextActions } from 'hooks'
import { useParams, useRouter } from 'next/navigation'
import { ICreateWishlist, WishlistNest } from 'types'
import { SearchPlacePanel, WishlistForm, DropCardItem, TransformWishlistForm } from 'components'
import s from '../Wishlists.module.scss'
import { AccordionContextProvider } from 'components/providers'

const Wishlist = () => {
  const [openEditDrawer, setDrawerEditStatus] = useState(false)
  const [openTransformDrawer, setDrawerTransformStatus] = useState(false)
  const [initialValues, setInitialValues] = useState<undefined | ICreateWishlist>(undefined)

  const { setInfoMsg, setErrorMsg } = useContextActions()

  const dragType = 'wishlist'

  const params = useParams()
  const id = Number(params.id)
  const router = useRouter()

  const [isEditMode, setEditModeStatus] = useState(false)

  const { data: wishlist } = useTanstackQuery<WishlistNest>({
    url: `wishlists/${id}`,
    queryKey: ['wishlists', `${id}`],
  })

  const mutation = useTanstackMutation<{ message: string }>({
    url: 'wishlists',
    method: 'DELETE',
    queryKey: ['wishlists'],
    onSuccess: (data) => {
      if (data) {
        router.push('/wishlists')

        setInfoMsg(data.message)
      }
    },
  })

  useEffect(() => {
    if (mutation.error?.message) setErrorMsg(mutation.error?.message)
  }, [mutation.error?.message])

  const onEdit = () => {
    if (wishlist) {
      const { comment, title } = wishlist
      setInitialValues({
        title,
        ...(!!comment && { comment }),
      })
    }

    setDrawerEditStatus(true)
  }

  const onEditModeClick = () => setEditModeStatus((prevState) => !prevState)

  const onTransform = () => {
    setDrawerTransformStatus(true)
  }

  const onDelete = () => {
    mutation.mutate({ id })
  }

  const onCloseDrawerEdit = () => {
    setDrawerEditStatus(false)
  }

  const onCloseDrawerTransform = () => {
    setDrawerTransformStatus(false)
  }

  const onSuccessTransform = () => {
    onCloseDrawerTransform()
    router.push('/trips')
  }

  return (
    <div>
      {wishlist && (
        <AccordionContextProvider>
          <div className={s.wlItemWrapper}>
            <div className={s.title}>{wishlist.title}</div>
            <div className={s.editBtnWrapper}>
              <Button onClick={onEdit}>Edit</Button>
              <Button onClick={onTransform}>Transform wl to trip</Button>
              <Popconfirm
                title="Delete the wishlist"
                description="Are you sure to delete this wishlist from DB?"
                onConfirm={onDelete}>
                <Button>Delete</Button>
              </Popconfirm>
            </div>
            <div className={s.settingBtnWrapper}>
              <Button
                type={isEditMode ? 'primary' : 'text'}
                icon={<SettingOutlined />}
                onClick={onEditModeClick}
              />
            </div>
            <div className={s.dropSearchWrapper}>
              <DropCardItem
                id={id}
                type="wl"
                dragType={dragType}
                isEditMode={isEditMode}
                style={{ flex: 1, border: '1px solid #252525', padding: '20px 30px' }}
              />
              {isEditMode && <SearchPlacePanel dragType={dragType} />}
            </div>
            {!!wishlist?.comment && <p className={s.comment}>{wishlist.comment}</p>}

            <Drawer
              title="Update trip"
              onClose={onCloseDrawerEdit}
              open={openEditDrawer}
              width={800}
              destroyOnClose>
              <WishlistForm
                mode="update"
                id={id}
                initialValues={initialValues}
                onSuccess={onCloseDrawerEdit}
              />
            </Drawer>

            <Drawer
              title="Transform wishlist to trip"
              onClose={onCloseDrawerTransform}
              open={openTransformDrawer}
              width={800}
              destroyOnClose>
              <TransformWishlistForm
                id={id}
                title={wishlist?.title || ''}
                onSuccess={onSuccessTransform}
              />
            </Drawer>
          </div>
        </AccordionContextProvider>
      )}
    </div>
  )
}

export default Wishlist
