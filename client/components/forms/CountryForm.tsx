'use client'

import { FC, useEffect, useState } from 'react'
import { Button, Input, InputNumber } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ICreateCountry, CountryNest, EntityType, ImageAttributesNest, Coordinates } from 'types'
import { ImageUploadBlock, ImageIEdited, GoogleMapModal } from 'components'
import { useContextActions, useTanstackMutation } from 'hooks'
import { countrySchema } from './utils'
import { FTSModule } from './fts'
import s from './Form.module.scss'

interface CountryFormProps {
  mode: 'create' | 'update'
  id?: number | null
  initialValues?: ICreateCountry
  images?: ImageAttributesNest[]
  onSuccess?: () => void
}

export const CountryForm: FC<CountryFormProps> = (props) => {
  const { mode, id, initialValues, onSuccess, images = [] } = props

  const [file, setFile] = useState<Blob | null>(null)

  const { setInfoMsg, setErrorMsg } = useContextActions()

  const method = mode === 'create' ? 'POST' : 'PATCH'
  const btnText = mode === 'create' ? 'Create' : 'Update'

  const mutation = useTanstackMutation<CountryNest>({
    url: 'countries',
    method,
    queryKey: ['countries'],
    onSuccess: (data) => {
      if (data) {
        setInfoMsg(`Country - ${data.name} was ${btnText}`)
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
    resolver: yupResolver(countrySchema),
  })

  useEffect(() => {
    // It's recommended to reset in useEffect as execution order matters
    if (isSubmitSuccessful) {
      reset()
      setFile(null)
    }
  }, [isSubmitSuccessful, reset])

  const onSubmit: SubmitHandler<ICreateCountry> = async (values) => {
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v))
      } else {
        formData.set(key, value)
      }
    })

    if (file) {
      formData.append('file', file)
    }

    mutation.mutate({ formData, id, queryKeyWithId: id ? [['countries', `${id}`]] : [] })
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
          style={{ marginLeft: '7px' }}
          entityType={EntityType.COUNTRY}
          onSuccess={onSuccess}
        />
      ))}
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <div className={s.dropzoneWrapper}>
          <ImageUploadBlock onChange={setFile} file={file} />
          <div className={s.inputsWrapper}>
            <div>
              <div className={s.label}>Country name</div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Ukraine" />}
              />
              <div className={s.error}>{errors.name?.message}</div>
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
            <FTSModule<ICreateCountry> control={control} errors={errors} />
          </div>
        </div>
        <Button htmlType="submit" disabled={mutation.isPending}>
          {btnText}
        </Button>
      </form>
    </>
  )
}
