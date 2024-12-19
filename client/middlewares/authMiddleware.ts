import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { fetcher } from 'api'
import { CustomMiddleware } from './chain'
import { IUser } from 'types'

interface Tokens {
  accessToken: string
  refreshToken: string
  accessTokenExpires: number
  refreshTokenExpires: number
}

export async function getUserData({
  response,
  accessToken,
  maxAge,
}: {
  response: NextResponse
  accessToken: string
  maxAge: number
}) {
  const user: IUser = await fetcher({
    url: `users/me`,
    token: accessToken,
  })

  const role = user?.role || null
  const name = user?.name || user?.email || 'anonym'
  const email = user?.email || 'anonym'

  response.cookies.set('role', role, {
    maxAge,
    path: '/',
  })

  response.cookies.set('name', name, {
    maxAge,
    path: '/',
  })

  response.cookies.set('email', email, {
    maxAge,
    path: '/',
  })

  return response
}

async function getRoleAndSetAuthCookies(
  response: NextResponse,
  tokens: Tokens,
): Promise<NextResponse> {
  const { accessToken, refreshToken, accessTokenExpires, refreshTokenExpires } = tokens

  response.cookies.set('accessToken', accessToken, {
    maxAge: accessTokenExpires - 10,
    path: '/',
  })
  response.cookies.set('refreshToken', refreshToken, {
    maxAge: refreshTokenExpires - 10,
    path: '/',
  })

  if (accessToken && refreshTokenExpires) {
    await getUserData({
      response,
      accessToken,
      maxAge: refreshTokenExpires,
    })
  }

  return response
}

function redirectUnauth(pathname: string) {
  return !pathname.includes('login') && !pathname.includes('registration')
}
function redirectAuth(pathname: string) {
  return pathname.includes('login') || pathname.includes('registration') || pathname === '/'
}

export function authMiddleware(middleware: CustomMiddleware): CustomMiddleware {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    const tokenAccess = request.cookies.get('accessToken')?.value
    const tokenRefresh = request.cookies.get('refreshToken')?.value
    const { pathname, searchParams } = request.nextUrl

    if (pathname.includes('auth-success')) {
      const tokens: Tokens = {
        accessToken: searchParams.get('accessToken') || '',
        accessTokenExpires: Number(searchParams.get('accessTokenExpires') || 0),
        refreshToken: searchParams.get('refreshToken') || '',
        refreshTokenExpires: Number(searchParams.get('refreshTokenExpires') || 0),
      }

      if (tokens.accessToken && tokens.refreshToken) {
        const updatedResponse = NextResponse.redirect(new URL('/', request.url))
        await getRoleAndSetAuthCookies(updatedResponse, tokens)
        return updatedResponse
      }
    }

    if (!tokenAccess && !tokenRefresh && redirectUnauth(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (tokenAccess && tokenRefresh && redirectAuth(pathname)) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (!tokenAccess && tokenRefresh) {
      const response = await fetcher({
        url: `auth/refresh-token`,
        method: 'POST',
        body: { refreshToken: tokenRefresh },
      })

      if (response && response.accessToken && response.refreshToken) {
        const updatedResponse = NextResponse.next()
        await getRoleAndSetAuthCookies(updatedResponse, response)
        return middleware(request, event, updatedResponse)
      } else {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    if (tokenAccess) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('Authorization', `Bearer ${tokenAccess}`)
    }

    return middleware(request, event, response)
  }
}
