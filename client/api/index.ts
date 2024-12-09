/* eslint-disable @typescript-eslint/no-explicit-any */

interface HTTPError extends Error {
  info: string
  status: number
}

const handleError = (resJson: any): never => {
  const error = new Error(
    resJson?.message?.message || 'An error occurred while fetching the data.',
  ) as HTTPError
  error.info = resJson
  error.status = resJson?.statusCode || 500
  throw error
}

export const fetcher = async ({
  url,
  method,
  body,
  formData,
  token,
}: {
  url: string
  method?: 'POST' | 'GET' | 'PATCH' | 'DELETE'
  body?: object
  formData?: FormData
  token?: string
}): Promise<any> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, {
    method: method || 'GET',
    ...(!!body && { body: JSON.stringify(body) }),
    ...(!!formData && { body: formData }),
    credentials: 'include',
    headers: {
      ...(!formData && { 'Content-Type': 'application/json' }),
      ...(!!token && { Authorization: `Bearer ${token}` }),
    },
  })
  const resJson = await res.json()

  // if (resJson.statusCode === 401 && refreshToken) {
  //   const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`, {
  //     method: 'POST',
  //     body: JSON.stringify({ refreshToken }),
  //   })

  //   if (response.ok) {
  //     const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await response.json()

  //     if (!!newAccessToken && !!newRefreshToken) {
  //       cookieStore.set('accessToken', newAccessToken)
  //       cookieStore.set('refreshToken', newRefreshToken)

  //       return fetcher({ url, method, body, formData, token: newAccessToken })
  //     }
  //   }
  // }

  if (!res.ok) {
    handleError(resJson)
  }

  return resJson
}
