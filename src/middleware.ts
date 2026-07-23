import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const { pathname, search } = new URL(request.url)

  if (host === 'muscleatlas.site') {
    return NextResponse.redirect(
      `https://www.muscleatlas.site${pathname}${search}`,
      { status: 301 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|fonts/).*)',
  ],
}
