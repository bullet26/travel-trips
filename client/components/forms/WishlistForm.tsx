'use client'

import { FC, useEffect } from 'react'
import { Button, Input } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { WishlistNest, ICreateWishlist, UserNestInfo } from 'types'
import { useContextActions, useTanstackMutation, useTanstackQuery } from 'hooks'
import { wishlistSchema } from './utils'
import s from './Form.module.scss'

interface WishlistFormProps {
  mode: 'create' | 'update'
  id?: number | null
  initialValues?: ICreateWishlist
  onSuccess?: () => void
}

export const WishlistForm: FC<WishlistFormProps> = (props) => {
  const { mode, id, initialValues, onSuccess } = props

  const { TextArea } = Input

  const { setInfoMsg, setErrorMsg } = useContextActions()

  const method = mode === 'create' ? 'POST' : 'PATCH'
  const btnText = mode === 'create' ? 'Create' : 'Update'

  const { data: user } = useTanstackQuery<UserNestInfo>({
    url: 'users/me',
    queryKey: ['users'],
  })

  const mutation = useTanstackMutation<WishlistNest>({
    url: 'wishlists',
    method,
    queryKey: ['wishlists'],
    onSuccess: (data) => {
      if (data) {
        setInfoMsg(`Wishlist - ${data.title} was ${btnText}`)
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
    register,
    formState: { isSubmitSuccessful, errors },
  } = useForm({
    defaultValues: initialValues || {
      title: '',
      userId: 0,
    },
    resolver: yupResolver(wishlistSchema),
  })

  useEffect(() => {
    setValue('userId', user?.userId || 0)
  }, [user])

  useEffect(() => {
    // It's recommended to reset in useEffect as execution order matters
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful, reset])

  const onSubmit: SubmitHandler<ICreateWishlist> = async (values) => {
    mutation.mutate({ body: values, id, queryKeyWithId: id ? [['tags', `${id}`]] : [] })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={s.fullPageForm}>
        <div className={s.dropzoneWrapper}>
          <div className={s.inputsWrapper}>
            <input type="hidden" {...register('userId')} />
            <div>
              <div className={s.label}>Wishlist` title</div>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Prague future trip" />}
              />
              <div className={s.error}>{errors.title?.message}</div>
            </div>

            <div>
              <div className={s.label}>Comment</div>
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    value={getValues('comment') || ''}
                    placeholder="Type comment (optional)"
                    autoSize
                    style={{ resize: 'none' }}
                  />
                )}
              />
              <div className={s.error}>{errors.comment?.message}</div>
            </div>
          </div>
        </div>
        <Button htmlType="submit" disabled={mutation.isPending}>
          {btnText}
        </Button>
      </form>
    </>
  )
}
