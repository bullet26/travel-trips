/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie, setCookie } from 'cookies-next/client'
import { HTTPError } from 'types'

export const handleError = (resJson: any): never => {
  const error = new Error(
    resJson?.message?.message ||
      resJson?.message?.join(', ') ||
      'An error occurred while fetching the data.',
  ) as HTTPError
  error.info = resJson
  error.status = resJson?.statusCode || 500
  throw error
}

type FetcherProps = {
  url: string
  method?: 'POST' | 'GET' | 'PATCH' | 'DELETE'
  body?: object
  formData?: FormData
  token?: string
}

export const fetcher = async <T>({
  url,
  method,
  body,
  formData,
  token,
}: FetcherProps): Promise<T> => {
  const refreshToken = getCookie('refreshToken')
  const accessToken = token || getCookie('accessToken')

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, {
    next: { revalidate: false },
    method: method || 'GET',
    ...(!!body && { body: JSON.stringify(body) }),
    ...(!!formData && { body: formData }),
    //credentials: 'include', // не использ куки из-за react native
    headers: {
      ...(!formData && { 'Content-Type': 'application/json' }),
      ...(!!accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  })

  const resJson = await res.json()

  if (resJson.statusCode === 401 && refreshToken) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (response.ok) {
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExpires,
        refreshTokenExpires,
      } = await response.json()

      if (!!newAccessToken && !!newRefreshToken) {
        setCookie('accessToken', newAccessToken, {
          maxAge: accessTokenExpires - 10,
          path: '/',
        })
        setCookie('refreshToken', newRefreshToken, {
          maxAge: refreshTokenExpires - 10,
          path: '/',
        })

        return fetcher({ url, method, body, formData, token: newAccessToken })
      }
    }
  }

  if (!res.ok) {
    handleError(resJson)
  }

  return resJson
}
