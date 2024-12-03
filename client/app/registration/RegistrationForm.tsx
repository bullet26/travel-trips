'use client'

import { Button, Input } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ICreateUser } from 'types'

const schema = yup
  .object({
    name: yup.string().min(2).required(),
    email: yup.string().email().required(),
    password: yup.string().min(4).max(16).required(),
  })
  .required()

export const RegistrationForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<ICreateUser> = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>Name</div>
      <Controller
        {...register('name')}
        control={control}
        render={({ field }) => <Input {...field} placeholder="Enter your name" />}
      />
      <div>{errors.name?.message}</div>

      <div>Email</div>
      <Controller
        {...register('email')}
        control={control}
        render={({ field }) => <Input {...field} placeholder="youremail@email.com" />}
      />
      <div>{errors.email?.message}</div>

      <div>Password</div>
      <Controller
        {...register('password')}
        control={control}
        render={({ field }) => <Input.Password {...field} placeholder="Enter a unique password" />}
      />
      <div>{errors.password?.message}</div>

      <Button htmlType="submit">Continue</Button>
    </form>
  )
}
