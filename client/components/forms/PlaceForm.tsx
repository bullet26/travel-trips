'use client'

import { FC, useEffect, useState } from 'react'
import { Button, Input, InputNumber, Select, TreeSelect } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  ICreatePlace,
  PlaceNest,
  CountryNest,
  EntityType,
  ImageAttributesNest,
  Coordinates,
} from 'types'
import { ImageUploadBlock, ImageIEdited, GoogleMapModal } from 'components'
import { useContextActions, useTanstackMutation, useTanstackQuery } from 'hooks'
import { placeSchema, transformForSelect, transformForTreeSelect } from './utils'
import { FTSModule } from './fts'
import s from './Form.module.scss'

interface PlaceFormProps {
  mode: 'create' | 'update'
  id?: number | null
  initialValues?: ICreatePlace
  images?: ImageAttributesNest[]
  onSuccess?: () => void
}

export const PlaceForm: FC<PlaceFormProps> = (props) => {
  const { mode, id, initialValues, onSuccess, images = [] } = props

  const [file, setFile] = useState<Blob | null>(null)

  const { setInfoMsg, setErrorMsg } = useContextActions()

  const method = mode === 'create' ? 'POST' : 'PATCH'
  const btnText = mode === 'create' ? 'Create' : 'Update'

  const query = useTanstackQuery<CountryNest[]>({ url: 'countries', queryKey: ['countries'] })

  const queryTag = useTanstackQuery<CountryNest[]>({ url: 'tags', queryKey: ['tags'] })

  const mutation = useTanstackMutation<PlaceNest>({
    url: 'places',
    method,
    queryKey: ['places'],
    onSuccess: (data) => {
      if (data) {
        setInfoMsg(`Place - ${data.name} was ${btnText}`)
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
    defaultValues: initialValues || {
      name: '',
      translations: [''],
    },
    resolver: yupResolver(placeSchema),
  })

  useEffect(() => {
    // It's recommended to reset in useEffect as execution order matters
    if (isSubmitSuccessful) {
      reset()
      setFile(null)
    }
  }, [isSubmitSuccessful, reset])

  const onSubmit: SubmitHandler<ICreatePlace> = async (values) => {
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

    mutation.mutate({ formData, id, queryKeyWithId: id ? [['places', `${id}`]] : [] })
  }

  const setCoordinates = ({ latitude, longitude }: Coordinates) => {
    setValue('latitude', latitude)
    setValue('longitude', longitude)
  }

  return (
    <>
      {images.map((item) => (
        <ImageIEdited
          key={item.id}
          {...item}
          size="small"
          style={{ marginLeft: '10px' }}
          entityType={EntityType.PLACE}
          onSuccess={onSuccess}
        />
      ))}
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <div className={s.dropzoneWrapper}>
          <div className={s.dropZoneTagWrapper}>
            <ImageUploadBlock onChange={setFile} file={file} />
            <div>
              <div className={s.label}>Choose tags</div>
              <Controller
                name="tagIds"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Select tags"
                    options={transformForSelect(queryTag.data)}
                  />
                )}
              />
              <div className={s.error}>{errors.tagIds?.message}</div>
            </div>
          </div>
          <div className={s.inputsWrapper}>
            <div>
              <div className={s.label}>Place name</div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Saint Sophia Cathedral" />}
              />
              <div className={s.error}>{errors.name?.message}</div>
            </div>
            <div>
              <div className={s.label}>Description</div>
              <Controller
                name="description"
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
                name="cityId"
                control={control}
                render={({ field }) => (
                  <TreeSelect
                    {...field}
                    style={{ width: '100%' }}
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
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    autoComplete="one-time-code"
                    {...field}
                    placeholder="Volodymyrska St, 24"
                  />
                )}
              />
              <div className={s.error}>{errors.address?.message}</div>
            </div>
            <div className={s.geoWrapper}>
              <div>
                <div className={s.text}>Enter manually:</div>
                <div>
                  <div className={s.label}>Latitude</div>
                  <Controller
                    name="latitude"
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
                    name="longitude"
                    control={control}
                    render={({ field }) => (
                      <InputNumber {...field} controls={false} placeholder="30.523333" />
                    )}
                  />
                  <div className={s.error}>{errors.longitude?.message}</div>
                </div>
              </div>
              <GoogleMapModal
                latitude={getValues('latitude')}
                longitude={getValues('longitude')}
                setCoordinates={setCoordinates}
              />
            </div>
            <FTSModule<ICreatePlace> control={control} errors={errors} />
          </div>
        </div>
        <Button htmlType="submit" disabled={mutation.isPending}>
          {btnText}
        </Button>
      </form>
    </>
  )
}
