import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Proteger /admin - solo para 'owner'
    if (path.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      if (token.role !== 'owner') {
        return NextResponse.redirect(new URL('/menu', req.url))
      }
    }

    // Proteger /caja - solo para 'staff' y 'owner'
    if (path.startsWith('/caja')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      if (token.role !== 'staff' && token.role !== 'owner') {
        return NextResponse.redirect(new URL('/menu', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ['/admin/:path*', '/caja/:path*']
}