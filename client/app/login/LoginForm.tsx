'use client'

import { useRouter } from 'next/navigation'
import { Button, Input } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ILoginUser } from 'types'
import * as yup from 'yup'
import { useState } from 'react'
import { ErrorMessage } from 'components/index'
import { fetcher } from 'api'
import s from './Login.module.scss'

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(4).max(16).required(),
  })
  .required()

const LoginForm = () => {
  const [error, setError] = useState('')

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
      url: `auth/login`,
      method: 'POST',
      body: data,
    })

    if (!!response?.accessToken) {
      router.push(
        `/auth-success?accessToken=${response.accessToken}&accessTokenExpires=${response.accessTokenExpires}&refreshToken=${response.refreshToken}&refreshTokenExpires=${response.refreshTokenExpires}`,
      )
    } else if (!!response?.error) {
      setError(response?.error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <div>
          <div className={s.label}>Email</div>
          <Controller
            {...register('email')}
            control={control}
            render={({ field }) => <Input {...field} placeholder="youremail@email.com" />}
          />
          <div className={s.error}>{errors.email?.message}</div>
        </div>

        <div>
          <div className={s.label}>Password</div>
          <Controller
            {...register('password')}
            control={control}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Enter a unique password" />
            )}
          />
          <div className={s.error}>{errors.password?.message}</div>
        </div>

        <Button htmlType="submit">Login</Button>
      </form>
      <ErrorMessage msg={error} />
    </>
  )
}

export default LoginForm
