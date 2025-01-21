'use client'

import { FC, useEffect } from 'react'
import { Button, DatePicker, Input } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { WishlistNest, ICreateWishlist } from 'types'
import { useContextActions, useTanstackMutation } from 'hooks'
import { getDate, setDate, wishlistTransformSchema } from './utils'
import s from './Form.module.scss'

interface TransformWishlistFormProps {
  id?: number | null
  title: string
  onSuccess?: () => void
}

export const TransformWishlistForm: FC<TransformWishlistFormProps> = (props) => {
  const { title, id, onSuccess } = props

  const { RangePicker } = DatePicker

  const { setInfoMsg, setErrorMsg } = useContextActions()

  const mutation = useTanstackMutation<WishlistNest>({
    url: 'wishlists/transform-to-trip',
    method: 'PUT',
    queryKey: ['wishlists', 'trips'],
    onSuccess: (data) => {
      if (data) {
        setInfoMsg(`Wishlist was transform to trip ${data.title}`)
        if (onSuccess) onSuccess()
      }
    },
  })

  useEffect(() => {
    if (mutation.error?.message) setErrorMsg(mutation.error?.message)
  }, [mutation.error?.message])

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isSubmitSuccessful, errors },
  } = useForm({
    defaultValues: { title },
    resolver: yupResolver(wishlistTransformSchema),
  })

  useEffect(() => {
    // It's recommended to reset in useEffect as execution order matters
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful, reset])

  const onSubmit: SubmitHandler<ICreateWishlist> = async (values) => {
    mutation.mutate({ body: values, id })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={s.fullPageForm}>
        <div className={s.dropzoneWrapper}>
          <div className={s.inputsWrapper}>
            <div>
              <div className={s.label}>Trip` title</div>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Prague future trip" />}
              />
              <div className={s.error}>{errors.title?.message}</div>
            </div>
            <div>
              <div className={s.label}>Choose start and finish date</div>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <RangePicker
                    {...field}
                    value={getDate(getValues)}
                    onChange={(dates) => setDate(dates, setValue)}
                  />
                )}
              />
              <div className={s.error}>{errors.startDate?.message}</div>
            </div>
          </div>
        </div>
        <Button htmlType="submit" disabled={mutation.isPending}>
          Transform
        </Button>
      </form>
    </>
  )
}
