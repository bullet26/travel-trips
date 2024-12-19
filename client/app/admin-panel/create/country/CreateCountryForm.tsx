'use client'

import { useState } from 'react'
import { Button, Input, InputNumber } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ICreateCountry } from 'types'
import { ErrorMessage, InfoMessage } from 'components'
import { useTanstackMutation } from 'hooks'
import s from './Country.module.scss'

const schema = yup
  .object({
    name: yup.string().min(4).required(),
    latitude: yup.number().min(-90).max(90).required(),
    longitude: yup.number().min(-180).max(180).required(),
  })
  .required()

export const CreateCountryForm = () => {
  const [infoMsg, setInfoMsg] = useState<string | null>(null)

  const mutation = useTanstackMutation({
    url: 'countries',
    method: 'POST',
    queryKey: ['countries'],
    onSuccess: (data) => {
      if (data) {
        setInfoMsg(`New country - ${(data as ICreateCountry).name} was created`)
      }
    },
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<ICreateCountry> = async (values) => {
    mutation.mutate(values)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
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
        <Button htmlType="submit" disabled={mutation.isPending}>
          Create
        </Button>
      </form>
      <ErrorMessage msg={mutation.error?.message} />
      <InfoMessage msg={infoMsg} />
    </>
  )
}
