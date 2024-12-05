'use client'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button, Input } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ILoginUser } from 'types'
import * as yup from 'yup'

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
    const response = await signIn('credentials', {
      ...data,
      redirect: false,
    })

    if (response && !response.error) {
      router.push('/')
    } else {
      console.log(response) // todo make error handler
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
