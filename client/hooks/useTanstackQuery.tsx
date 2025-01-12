import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { fetcher } from 'api'

type UseTanstackQueryProps<T> = {
  url: string
  queryKey: string[]
  options?: UseQueryOptions<T>
  id?: string | string[]
  enabled?: boolean
}

export const useTanstackQuery = <T,>({
  url,
  queryKey: incomeQKey,
  options,
  id,
  enabled = true,
}: UseTanstackQueryProps<T>): UseQueryResult<T> => {
  const fullUrl = id ? `${url}/${id}` : url
  const idKey = Array.isArray(id) ? id.join(',') : id
  const queryKey = !!id ? [...incomeQKey, idKey] : incomeQKey

  return useQuery<T>({
    queryKey,
    queryFn: () => fetcher<T>({ url: fullUrl, method: 'GET' }),
    enabled,
    ...options,
  })
}
