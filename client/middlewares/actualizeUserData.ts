import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { CustomMiddleware } from './chain'
import { getUserData } from './authMiddleware'

export function actualizeUserData(middleware: CustomMiddleware): CustomMiddleware {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    const role = request.cookies.get('role')?.value
    const name = request.cookies.get('name')?.value
    const email = request.cookies.get('email')?.value
    const accessToken = request.cookies.get('accessToken')?.value

    if ((!role || !name || !email) && accessToken) {
      const updatedResponse = NextResponse.next()

      await getUserData({
        response: updatedResponse,
        accessToken,
        maxAge: 7 * 24 * 60 * 60,
      })
      return middleware(request, event, updatedResponse)
    }

    return middleware(request, event, response)
  }
}
