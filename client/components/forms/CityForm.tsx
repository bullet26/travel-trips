'use client'

import { FC, useEffect, useState } from 'react'
import { Button, Input, InputNumber, Select } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ICreateCity, CountryNest, CityNest, EntityType, ImageAttributesNest } from 'types'
import { ImageUploadBlock, ImageIEdited } from 'components'
import { useContextActions, useTanstackMutation, useTanstackQuery } from 'hooks'
import { citySchema, transformForSelect } from './utils'
import { FTSModule } from './fts'
import s from './Form.module.scss'

interface CityFormProps {
  mode: 'create' | 'update'
  id?: number | null
  initialValues?: ICreateCity
  images?: ImageAttributesNest[]
  onSuccess?: () => void
}

export const CityForm: FC<CityFormProps> = (props) => {
  const { mode, id, initialValues, onSuccess, images = [] } = props

  const [file, setFile] = useState<Blob | null>(null)

  const { setInfoMsg, setErrorMsg } = useContextActions()

  const method = mode === 'create' ? 'POST' : 'PATCH'
  const btnText = mode === 'create' ? 'Create' : 'Update'

  const query = useTanstackQuery<CountryNest[]>({ url: 'countries', queryKey: ['countries'] })

  const mutation = useTanstackMutation<CityNest>({
    url: 'cities',
    method,
    queryKey: ['cities'],
    onSuccess: (data) => {
      if (data) {
        setInfoMsg(`New city - ${data.name} was ${btnText}`)
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
    formState: { isSubmitSuccessful, errors },
  } = useForm({
    defaultValues: initialValues || {
      name: '',
      translations: [''],
    },
    resolver: yupResolver(citySchema),
  })

  useEffect(() => {
    // It's recommended to reset in useEffect as execution order matters
    if (isSubmitSuccessful) {
      reset()
      setFile(null)
    }
  }, [isSubmitSuccessful, reset])

  const onSubmit: SubmitHandler<ICreateCity> = async (values) => {
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

    mutation.mutate({ formData, id, queryKeyWithId: [['cities'], ['cities', `${id}`]] })
  }

  return (
    <>
      {images.map((item) => (
        <ImageIEdited
          key={item.id}
          {...item}
          size="small"
          style={{ marginLeft: '10px' }}
          entityType={EntityType.CITY}
          onSuccess={onSuccess}
        />
      ))}
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <div className={s.dropzoneWrapper}>
          <ImageUploadBlock onChange={setFile} file={file} />
          <div className={s.inputsWrapper}>
            <div>
              <div className={s.label}>City name</div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Kyiv" />}
              />
              <div className={s.error}>{errors.name?.message}</div>
            </div>
            <div>
              <div className={s.label}>Choose country</div>
              <Controller
                name="countryId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    placeholder="Choose country"
                    optionFilterProp="label"
                    options={transformForSelect(query?.data)}
                  />
                )}
              />
              <div className={s.error}>{errors.countryId?.message}</div>
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
              <Button shape="round">Choose on map</Button>
            </div>
            <FTSModule<ICreateCity> control={control} errors={errors} />
          </div>
        </div>
        <Button htmlType="submit" disabled={mutation.isPending}>
          {btnText}
        </Button>
      </form>
    </>
  )
}
