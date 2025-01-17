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
    onSuccess: async (data, { queryKeyWithId }) => {
      if (onSuccess) onSuccess(data)

      if (queryKey?.length) {
        await queryClient.invalidateQueries({ queryKey })
      }

      if (queryKeyWithId?.length) {
        for (const queryKey of queryKeyWithId) {
          await queryClient.invalidateQueries({ queryKey, refetchType: 'all' })
          //await queryClient.refetchQueries({ queryKey })
        }
      }

      if (!queryKeyWithId?.length && !queryKey?.length) {
        await queryClient.invalidateQueries()
      }
    },
  })
}
