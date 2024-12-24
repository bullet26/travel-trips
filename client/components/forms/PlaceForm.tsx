'use client'

import { FC, useState } from 'react'
import { Button, Input, InputNumber, TreeSelect } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ICreatePlace, PlaceNest, CountryNest, EntityType } from 'types'
import { DropZone, ErrorMessage, ImageIEdited, InfoMessage } from 'components'
import { useTanstackMutation, useTanstackQuery } from 'hooks'
import { placeSchema, transformForTreeSelect } from './utils'
import s from './Form.module.scss'

interface PlaceFormProps {
  mode: 'crete' | 'update'
  id?: number | null
  initialValues?: PlaceNest
  onSuccess?: () => void
}

export const PlaceForm: FC<PlaceFormProps> = (props) => {
  const { mode, id, initialValues, onSuccess } = props

  const [infoMsg, setInfoMsg] = useState<string | null>(null)
  const [file, setFile] = useState<string | Blob | null>(null)

  const method = mode === 'crete' ? 'POST' : 'PATCH'
  const btnText = mode === 'crete' ? 'Create' : 'Update'

  const query = useTanstackQuery<CountryNest[]>({ url: 'countries', queryKey: ['countries'] })

  const mutation = useTanstackMutation<PlaceNest>({
    url: 'places',
    method,
    queryKey: ['places'],
    onSuccess: (data) => {
      if (data) {
        setInfoMsg(`New place - ${data.name} was created`)
        if (onSuccess) onSuccess()
      }
    },
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues || {
      name: '',
    },
    resolver: yupResolver(placeSchema),
  })

  const onSubmit: SubmitHandler<ICreatePlace> = async (values) => {
    if (file) {
      const formData = new FormData()

      Object.entries(values).forEach(([key, value]) => {
        formData.set(key, value)
      })
      formData.append('file', file)
      mutation.mutate({ formData, id })
    } else {
      mutation.mutate({ body: values, id })
    }
  }

  return (
    <>
      {initialValues?.images.map((item) => (
        <ImageIEdited
          {...item}
          size="small"
          style={{ marginLeft: '10px' }}
          entityType={EntityType.PLACE}
          onSuccess={onSuccess}
        />
      ))}
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <div className={s.dropzoneWrapper}>
          <DropZone onChange={setFile} />
          <div className={s.inputsWrapper}>
            <div>
              <div className={s.label}>Place name</div>
              <Controller
                {...register('name')}
                control={control}
                render={({ field }) => <Input {...field} placeholder="Saint Sophia Cathedral" />}
              />
              <div className={s.error}>{errors.name?.message}</div>
            </div>
            <div>
              <div className={s.label}>Description</div>
              <Controller
                {...register('description')}
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    autoSize
                    style={{ resize: 'none' }}
                    {...field}
                    placeholder="Saint Sophia Cathedral in Kyiv, Ukraine, is an architectural monument ..."
                  />
                )}
              />
              <div className={s.error}>{errors.description?.message}</div>
            </div>
            <div>
              <div className={s.label}>Choose city</div>
              <Controller
                {...register('cityId')}
                control={control}
                render={({ field }) => (
                  <TreeSelect
                    {...field}
                    style={{ width: '100%' }}
                    showSearch
                    allowClear
                    placeholder="Choose city"
                    treeData={transformForTreeSelect(query?.data)}
                  />
                )}
              />
              <div className={s.error}>{errors.cityId?.message}</div>
            </div>
            <div>
              <div className={s.label}>Place address</div>
              <Controller
                {...register('address')}
                control={control}
                render={({ field }) => <Input {...field} placeholder="Volodymyrska St, 24" />}
              />
              <div className={s.error}>{errors.address?.message}</div>
            </div>
            <div className={s.geoWrapper}>
              <div>
                <div className={s.text}>Enter manually:</div>
                <div>
                  <div className={s.label}>Latitude</div>
                  <Controller
                    {...register('latitude')}
                    control={control}
                    render={({ field }) => (
                      <InputNumber {...field} controls={false} placeholder="50.450001" />
                    )}
                  />
                  <div className={s.error}>{errors.latitude?.message}</div>
                </div>
                <div>
                  <div className={s.label}>Longitude</div>
                  <Controller
                    {...register('longitude')}
                    control={control}
                    render={({ field }) => (
                      <InputNumber {...field} controls={false} placeholder="30.523333" />
                    )}
                  />
                  <div className={s.error}>{errors.longitude?.message}</div>
                </div>
              </div>
              <Button shape="round">Choose on map</Button>
            </div>
          </div>
        </div>
        <Button htmlType="submit" disabled={mutation.isPending}>
          {btnText}
        </Button>
      </form>
      <ErrorMessage msg={mutation.error?.message} />
      <InfoMessage msg={infoMsg} />
    </>
  )
}
