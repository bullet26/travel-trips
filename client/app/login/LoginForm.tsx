'use client'

import { useRouter } from 'next/navigation'
import { Button, Input } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ILoginUser } from 'types'
import * as yup from 'yup'
import { fetcher } from 'api'

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

  const router = useRouter()

  const onSubmit: SubmitHandler<ILoginUser> = async (data) => {
    const response = await fetcher({
      url: 'auth/login',
      method: 'POST',
      body: data,
    })

    if (response?.accessToken) {
      console.log(response?.accessToken)
      // TODO нужно сохранять токен, так как middleware не видит его и возвращает назад на логин
      router.push(`/home`)
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
