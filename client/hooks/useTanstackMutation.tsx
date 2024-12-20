import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher } from 'api'

type UseTanstackMutationProps<T> = {
  url: string
  queryKey?: string[]
  method: 'POST' | 'GET' | 'PATCH' | 'DELETE'
  onSuccess?: (data?: T) => void
}

type mutationFnProps = {
  id?: number
  body?: object
}

export const useTanstackMutation = <T,>({
  url,
  queryKey,
  method,
  onSuccess,
}: UseTanstackMutationProps<T>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: mutationFnProps) => {
      let fullUrl = url
      if (id) fullUrl = `${url}/${id}`

      return fetcher<T>({ url: fullUrl, method, body })
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data)

      if (queryKey?.length) {
        queryClient.invalidateQueries({ queryKey })
      } else {
        queryClient.invalidateQueries()
      }
    },
  })
}
