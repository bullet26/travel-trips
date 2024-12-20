import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { fetcher } from 'api'

type UseTanstackQueryProps<T> = {
  url: string
  queryKey: string[]
  options?: UseQueryOptions<T>
}

export const useTanstackQuery = <T,>({
  url,
  queryKey,
  options,
}: UseTanstackQueryProps<T>): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey: queryKey,
    queryFn: () => fetcher<T>({ url, method: 'GET' }),
    ...options,
  })
}
