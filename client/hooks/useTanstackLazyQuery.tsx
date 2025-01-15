'use client'

import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { fetcher } from 'api'
import { useState } from 'react'

type UseTanstackQueryProps<T> = {
  url: string
  queryKey: string[]
  options?: UseQueryOptions<T>
}

export const useTanstackLazyQuery = <T, TVariable>({
  url,
  queryKey,
  options,
}: UseTanstackQueryProps<T>) => {
  const [variable, setVariable] = useState<TVariable | undefined>(undefined)
  const [isTriggered, setTriggered] = useState(false)

  const queryFn = () => {
    if (!variable) {
      return fetcher<T>({ url, method: 'GET' })
    }
    return fetcher<T>({ url: `${url}/${variable}`, method: 'GET' })
  }

  const queryKeyFull = variable ? [...queryKey, variable] : queryKey

  const queryInfo = useQuery<T>({
    queryKey: queryKeyFull,
    queryFn,
    enabled: isTriggered,
    ...options,
  })

  const trigger = (newVariable?: TVariable) => {
    setVariable(newVariable)
    setTriggered(true)
  }

  return [trigger, queryInfo] as const
}
