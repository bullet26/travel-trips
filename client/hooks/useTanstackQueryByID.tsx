import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { fetcher } from 'api'

type UseTanstackQueryProps<T> = {
  url: string
  queryKey: string[]
  options?: UseQueryOptions<T>
  id: number | null
}

export const useTanstackQueryByID = <T,>({
  url,
  queryKey,
  options,
  id,
}: UseTanstackQueryProps<T>): UseQueryResult<T> => {
  let fullUrl = url
  if (id) fullUrl = `${url}/${id}`

  return useQuery<T>({
    queryKey: queryKey,
    queryFn: () => fetcher<T>({ url: fullUrl, method: 'GET' }),
    ...options,
    enabled: !!id,
  })
}
