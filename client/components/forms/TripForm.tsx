'use client'

import { FC, useEffect, useState } from 'react'
import { Button, Input, DatePicker } from 'antd'
import type { GetProps } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { TripsNest, EntityType, ImageAttributesNest, ICreateTrip, UserNestInfo } from 'types'
import { ImageUploadBlock, ImageIEdited } from 'components'
import { useContextActions, useTanstackMutation, useTanstackQuery } from 'hooks'
import { tripSchema } from './utils'
import s from './Form.module.scss'

interface TripFormProps {
  mode: 'create' | 'update'
  id?: number | null
  initialValues?: ICreateTrip
  images?: ImageAttributesNest[]
  onSuccess?: () => void
}

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

dayjs.extend(utc)

export const TripForm: FC<TripFormProps> = (props) => {
  const { mode, id, initialValues, onSuccess, images = [] } = props

  const { RangePicker } = DatePicker
  const { TextArea } = Input

  const [file, setFile] = useState<Blob | null>(null)

  const { setInfoMsg, setErrorMsg } = useContextActions()

  const method = mode === 'create' ? 'POST' : 'PATCH'
  const btnText = mode === 'create' ? 'Create' : 'Update'

  const { data: user } = useTanstackQuery<UserNestInfo>({
    url: 'users/me',
    queryKey: ['users'],
  })

  const mutation = useTanstackMutation<TripsNest>({
    url: 'trips',
    method,
    queryKey: ['trips'],
    onSuccess: (data) => {
      if (data) {
        setInfoMsg(`New trip - ${data.title} was ${btnText}`)
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
    resolver: yupResolver(tripSchema),
  })

  useEffect(() => {
    setValue('userId', user?.userId || 0)
  }, [user])

  useEffect(() => {
    // It's recommended to reset in useEffect as execution order matters
    if (isSubmitSuccessful) {
      reset()
      setFile(null)
    }
  }, [isSubmitSuccessful, reset])

  const onSubmit: SubmitHandler<ICreateTrip> = async (values) => {
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v))
      } else {
        formData.set(key, value)
      }
    })

    if (file) {
      formData.append('file', file)
    }

    mutation.mutate({ formData, id, queryKeyWithId: id ? [['trips', `${id}`]] : [] })
  }

  const getDate = (): [dayjs.Dayjs | null, dayjs.Dayjs | null] => {
    const start = getValues('startDate') ? dayjs(getValues('startDate')).local() : null
    const end = getValues('finishDate') ? dayjs(getValues('finishDate')).local() : null
    return [start, end]
  }

  const setDate = (dates: RangePickerProps['value']) => {
    if (dates?.length === 2) {
      const [startDate, finishDate] = dates
      if (startDate) setValue('startDate', startDate.utc().toDate())
      if (finishDate) setValue('finishDate', finishDate.utc().toDate())
    }
  }

  return (
    <>
      {images.map((item) => (
        <ImageIEdited
          key={item.id}
          {...item}
          size="small"
          style={{ marginLeft: '7px' }}
          entityType={EntityType.COUNTRY}
          onSuccess={onSuccess}
        />
      ))}
      <form onSubmit={handleSubmit(onSubmit)} className={s.fullPageForm}>
        <div className={s.dropzoneWrapper}>
          <ImageUploadBlock onChange={setFile} file={file} />
          <div className={s.inputsWrapper}>
            <input type="hidden" {...register('userId')} />
            <div>
              <div className={s.label}>Trip` title</div>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Berlin trip, 2024" />}
              />
              <div className={s.error}>{errors.title?.message}</div>
            </div>
            <div>
              <div className={s.label}>Choose start and finish date</div>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <RangePicker {...field} value={getDate()} onChange={setDate} />
                )}
              />
              <div className={s.error}>{errors.startDate?.message}</div>
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
