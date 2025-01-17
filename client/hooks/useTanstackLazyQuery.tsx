'use client'

import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { fetcher } from 'api'
import { useState } from 'react'

type UseTanstackQueryProps<T> = {
  url: string
  queryKey?: string[]
  options?: UseQueryOptions<T>
}

export const useTanstackLazyQuery = <T, TVariable>({
  url,
  queryKey: incomeQKey,
  options,
}: UseTanstackQueryProps<T>) => {
  const [variable, setVariable] = useState<TVariable | undefined>(undefined)
  const [isTriggered, setTriggered] = useState(false)
  const [queryKey, seQueryKey] = useState(incomeQKey || [])

  const queryFn = () => {
    if (!variable) {
      return fetcher<T>({ url, method: 'GET' })
    }
    return fetcher<T>({ url: `${url}/${variable}`, method: 'GET' })
  }

  const queryInfo = useQuery<T>({
    queryKey,
    queryFn,
    enabled: !!variable || isTriggered,
    ...options,
  })

  const trigger = (newVariable?: TVariable, queryKeyWithId?: string[]) => {
    setVariable(newVariable)
    setTriggered(true)
    if (queryKeyWithId) {
      seQueryKey(queryKeyWithId)
    }
  }

  return [trigger, queryInfo] as const
}
