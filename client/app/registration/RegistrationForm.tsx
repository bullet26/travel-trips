'use client'
import { useRouter } from 'next/navigation'
import { Button, Input } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ICreateUser, HTTPError, NestAuthTokens } from 'types'
import { fetcher } from 'api'
import { useContextActions } from 'hooks'
import s from '@/login/Login.module.scss'

const schema = yup
  .object({
    name: yup.string().min(2).required(),
    email: yup.string().email().required(),
    password: yup.string().min(4).max(16).required(),
  })
  .required()

export const RegistrationForm = () => {
  const { setErrorMsg } = useContextActions()

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

  const router = useRouter()

  const onSubmit: SubmitHandler<ICreateUser> = async (data) => {
    try {
      const response = await fetcher<NestAuthTokens>({
        url: `auth/registration`,
        method: 'POST',
        body: data,
      })

      if (!!response?.accessToken) {
        router.push(
          `/auth-success?accessToken=${response.accessToken}&accessTokenExpires=${response.accessTokenExpires}&refreshToken=${response.refreshToken}&refreshTokenExpires=${response.refreshTokenExpires}`,
        )
      }
    } catch (error) {
      setErrorMsg((error as HTTPError).message)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <div>
          <div className={s.label}>Name</div>
          <Controller
            {...register('name')}
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter your name" />}
          />
          <div className={s.error}>{errors.name?.message}</div>
        </div>

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

        <Button htmlType="submit">Continue</Button>
      </form>
    </>
  )
}
