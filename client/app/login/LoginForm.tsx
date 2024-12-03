'use client'

import { Button, Input } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ILoginUser } from 'types'
import * as yup from 'yup'
import { NextResponse } from 'next/server'
import api from 'api'

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(4).max(16).required(),
  })
  .required()

const LoginForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<ILoginUser> = async (data) => {
    try {
      const res: { accessToken: string } = await api
        .post(`auth/login`, {
          json: data,
        })
        .json()

      if (res) {
        const { accessToken } = res
        const resNext = NextResponse.next()
        resNext.cookies.set('accessToken', accessToken)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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

      <Button htmlType="submit">Login</Button>
    </form>
  )
}

export default LoginForm
