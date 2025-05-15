'use server'

import { headers } from 'next/headers'

export const getOriginURl = async () => {
  const headersList = await headers()
  const host = headersList.get('host') // example.com
  const protocol = headersList.get('x-forwarded-proto') || 'https' // usually 'https' on Vercel
  const origin = `${protocol}://${host}`
  return origin
}
