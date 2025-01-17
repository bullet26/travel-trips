import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher } from 'api'

type UseTanstackMutationProps<T> = {
  url: string
  queryKey?: string[]
  method: 'POST' | 'GET' | 'PATCH' | 'DELETE'
  onSuccess?: (data?: T) => void
}

type mutationFnProps = {
  id?: number | null
  body?: object
  formData?: FormData
  queryKeyWithId?: string[][]
}

export const useTanstackMutation = <T,>({
  url,
  queryKey,
  method,
  onSuccess,
}: UseTanstackMutationProps<T>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body, formData }: mutationFnProps) => {
      let fullUrl = url
      if (id) fullUrl = `${url}/${id}`

      return fetcher<T>({ url: fullUrl, method, body, formData })
    },
    onSuccess: (data, { queryKeyWithId }) => {
      if (onSuccess) onSuccess(data)

      if (queryKeyWithId?.length) {
        queryKeyWithId.forEach((queryKey) => {
          console.log(queryKey, 'queryKeyWithId useMutation')
          queryClient.invalidateQueries({ queryKey })
        })
      } else if (queryKey?.length) {
        console.log(queryKey, 'queryKey useMutation')
        queryClient.invalidateQueries({ queryKey })
      } else {
        queryClient.invalidateQueries()
      }
    },
  })
}
