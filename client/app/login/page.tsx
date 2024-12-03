'use client'

import { Button, Input, Select } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

interface IFormInput {
  firstName: string
  lastName: string
  iceCreamType: { label: string; value: string }
}

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
  })
  .required()

const Login = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        {...register('firstName')}
        control={control}
        render={({ field }) => <Input {...field} />}
      />
      <p>{errors.firstName?.message}</p>

      <Controller
        {...register('lastName')}
        control={control}
        render={({ field }) => <Input {...field} />}
      />
      <p>{errors.lastName?.message}</p>

      <Button htmlType="submit">Login</Button>
    </form>
  )
}
export default Login
