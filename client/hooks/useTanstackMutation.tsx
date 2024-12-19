import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher } from 'api'

export const useTanstackMutation = ({
  url,
  queryKey,
  method,
  onSuccess,
}: {
  url: string
  queryKey?: string[]
  method: 'POST' | 'GET' | 'PATCH' | 'DELETE'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (data?: any) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body?: object) => fetcher({ url, method, body }),
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
