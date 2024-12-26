'use server'

import { cookies } from 'next/headers'

import { handleError } from './fetcherClient'

export const fetcherServer = async <T>({
  url,
  token,
}: {
  url: string
  token?: string
}): Promise<T> => {
  const cookieStore = await cookies()
  const accessToken = token || cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, {
    method: 'GET',
    next: { revalidate: 300 },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
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
      const cookieStore = await cookies()

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExpires,
        refreshTokenExpires,
      } = await response.json()

      if (!!newAccessToken && !!newRefreshToken) {
        cookieStore.set('accessToken', newAccessToken, {
          maxAge: accessTokenExpires - 10,
          path: '/',
        })
        cookieStore.set('refreshToken', newRefreshToken, {
          maxAge: refreshTokenExpires - 10,
          path: '/',
        })

        return fetcherServer({ url, token: newAccessToken })
      }
    }
  }

  if (!res.ok) {
    handleError(resJson)
  }

  return resJson
}
