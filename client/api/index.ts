// import { cookies } from 'next/headers'

interface HTTPError extends Error {
  info: string
  status: number
}

export const fetcher = async ({
  url,
  method,
  body,
  formData,
  incomeToken,
}: {
  url: string
  method?: 'POST' | 'GET' | 'DELETE'
  body?: object
  formData?: FormData
  incomeToken?: string
}) => {
  const token = incomeToken

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, {
    method: method || 'GET',
    ...(!!body && { body: JSON.stringify(body) }),
    ...(!!formData && { body: formData }),
    credentials: 'include',
    headers: {
      ...(!!token && { Authorization: `Bearer ${token}` }),
      'Content-type': 'application/json',
    },
  })

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.') as HTTPError
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}
