import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('refreshToken')

  if (request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.next()
  }

  if (!token) {
    // return NextResponse.rewrite(new URL('/login', request.url))
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
