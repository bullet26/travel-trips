import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { CustomMiddleware } from './chain'

export function roleGuardMiddleware(middleware: CustomMiddleware): CustomMiddleware {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    const role = request.cookies.get('role')?.value
    const { pathname } = request.nextUrl

    if ((!role || role !== 'ADMIN') && pathname.includes('admin-panel')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return middleware(request, event, response)
  }
}
