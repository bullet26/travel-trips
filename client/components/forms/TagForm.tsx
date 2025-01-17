'use client'

import { FC, useEffect } from 'react'
import { Button, Input } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ICreateTag, TagNest } from 'types'
import { useContextActions, useTanstackMutation } from 'hooks'
import { tagSchema } from './utils'
import s from './Form.module.scss'

interface TagFormProps {
  mode: 'create' | 'update'
  id?: number | null
  initialValues?: ICreateTag
  onSuccess?: () => void
}

export const TagForm: FC<TagFormProps> = (props) => {
  const { mode, id, initialValues, onSuccess } = props

  const { setInfoMsg, setErrorMsg } = useContextActions()

  const method = mode === 'create' ? 'POST' : 'PATCH'
  const btnText = mode === 'create' ? 'Create' : 'Update'

  const mutation = useTanstackMutation<TagNest>({
    url: 'tags',
    method,
    queryKey: ['tags'],
    onSuccess: (data) => {
      if (data) {
        setInfoMsg(`New Tag - ${data.name} was ${btnText}`)
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
    formState: { isSubmitSuccessful, errors },
  } = useForm({
    defaultValues: initialValues || {
      name: '',
    },
    resolver: yupResolver(tagSchema),
  })

  useEffect(() => {
    // It's recommended to reset in useEffect as execution order matters
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful, reset])

  const onSubmit: SubmitHandler<ICreateTag> = async (values) => {
    mutation.mutate({ body: values, id, queryKeyWithId: [['tags'], ['tags', `${id}`]] })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <div className={s.inputsWrapper}>
          <div>
            <div className={s.label}>Tag name</div>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} placeholder="baroque" />}
            />
            <div className={s.error}>{errors.name?.message}</div>
          </div>
        </div>
        <Button htmlType="submit" disabled={mutation.isPending}>
          {btnText}
        </Button>
      </form>
    </>
  )
}
