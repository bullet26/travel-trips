import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { fetcher } from 'api'

type UseTanstackQueryProps<T> = {
  url: string
  queryKey: string[]
  options?: UseQueryOptions<T>
  enabled?: boolean
}

export const useTanstackQuery = <T,>({
  url,
  queryKey,
  options,
  enabled = true,
}: UseTanstackQueryProps<T>): UseQueryResult<T> => {
  console.log('useTanstackQuery queryKey', queryKey)
  return useQuery<T>({
    queryKey,
    queryFn: () => fetcher<T>({ url, method: 'GET' }),
    enabled,
    ...options,
  })
}
