'use client'

import { FC, useState } from 'react'
import { Button, Input, InputNumber } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ICreateCountry, CountryNest, EntityType } from 'types'
import { DropZone, ErrorMessage, ImageIEdited, InfoMessage } from 'components'
import { useTanstackMutation } from 'hooks'
import { countrySchema } from './utils'
import s from './Form.module.scss'

interface CountryFormProps {
  mode: 'crete' | 'update'
  id?: number | null
  initialValues?: CountryNest
  onSuccess?: () => void
}

export const CountryForm: FC<CountryFormProps> = (props) => {
  const { mode, id, initialValues, onSuccess } = props

  const [infoMsg, setInfoMsg] = useState<string | null>(null)
  const [file, setFile] = useState<string | Blob | null>(null)

  const method = mode === 'crete' ? 'POST' : 'PATCH'
  const btnText = mode === 'crete' ? 'Create' : 'Update'

  const mutation = useTanstackMutation<CountryNest>({
    url: 'countries',
    method,
    queryKey: ['countries'],
    onSuccess: (data) => {
      if (data) {
        setInfoMsg(`New country - ${data.name} was created`)
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
    resolver: yupResolver(countrySchema),
  })

  const onSubmit: SubmitHandler<ICreateCountry> = async (values) => {
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      formData.set(key, value)
    })

    if (file) {
      formData.append('file', file)
    }

    mutation.mutate({ formData, id })
  }

  return (
    <>
      {initialValues?.images.map((item) => (
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
          <DropZone onChange={setFile} />
          <div className={s.inputsWrapper}>
            <div>
              <div className={s.label}>Country name</div>
              <Controller
                {...register('name')}
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
