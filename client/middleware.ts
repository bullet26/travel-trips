import { NextURL } from 'next/dist/server/web/next-url'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fetcher } from 'api'

const verifyToken = async (token: string) => {
  try {
    const res = await fetcher({ url: `users/me`, incomeToken: token })
    return !!res
  } catch (error) {
    console.error('verifyToken error', error)
    return false
  }
}

const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshResponse = await fetcher({ url: `auth/refresh-token`, method: 'POST' })
    const accessToken = refreshResponse?.accessToken || null
    return accessToken
  } catch (error) {
    console.error('refreshToken error', error)
    return null
  }
}

const redirectForAuth = (url: NextURL) => {
  if (url.pathname === '/login' || url.pathname.includes('registration')) {
    return true
  }
  return false
}

const redirectForUnauth = (url: NextURL) => {
  if (!url.pathname.includes('login') && !url.pathname.includes('registration')) {
    return true
  }

  return false
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const url = request.nextUrl.clone()

  if (!token && redirectForUnauth(url)) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (!!token) {
    const isValid = await verifyToken(token)

    if (!isValid) {
      const accessToken = await refreshToken()

      if (!accessToken && redirectForUnauth(url)) {
        url.pathname = '/login'
        return NextResponse.redirect(url)
      } else if (!!accessToken) {
        const response = NextResponse.next()
        response.cookies.set('accessToken', accessToken)
        return response
      }
    }

    if (isValid && redirectForAuth(url)) {
      url.pathname = '/home'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

//Skip Next.js middleware for static and public files
export const config = { matcher: '/((?!.*\\.).*)' }
