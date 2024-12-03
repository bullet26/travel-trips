import { NextURL } from 'next/dist/server/web/next-url'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const verifyToken = async (token: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/users/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.ok
  } catch {
    return false
  }
}

const refreshToken = async () => {
  try {
    const refreshResponse = await fetch(`${process.env.NEXT_BACKEND_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    })

    if (refreshResponse.ok) {
      const { accessToken } = await refreshResponse.json()
      const res = NextResponse.next()
      res.cookies.set('accessToken', accessToken)
      return res
    }
  } catch {
    return null
  }
}

const forAuth = (url: NextURL) => {
  if (url.pathname === '/login') {
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }
  return null
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value
  const url = req.nextUrl.clone()
  console.log('req', req.url, url)

  if (!token) {
    if (!url.pathname.includes('login')) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  } else {
    const isValid = await verifyToken(token)

    if (!isValid) {
      const refreshResponse = await refreshToken()

      if (!refreshResponse) {
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }

      forAuth(url)
      return refreshResponse
    }

    forAuth(url)
  }

  return NextResponse.next()
}

//Skip Next.js middleware for static and public files
export const config = { matcher: '/((?!.*\\.).*)' }
