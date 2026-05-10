import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = [
  '/dashboard',
  '/trips',
  '/checklist',
  '/notes',
  '/community',
  '/profile',
  '/settings',
  '/search',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  const token = request.cookies.get('traveloop_token')?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/trips/:path*',
    '/checklist/:path*',
    '/notes/:path*',
    '/community/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/search/:path*',
  ],
}
