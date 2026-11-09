import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from '@/lib/adminAuth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── SEO: noindex header on all admin pages ───────────────────────────────
  const isAdminPath = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')

  if (isAdminPath || isAdminApi) {
    // ── Auth gate ────────────────────────────────────────────────────────────
    // /admin/login and /api/admin/auth are public (login form + login endpoint)
    const isLoginPage = pathname === '/admin/login'
    const isAuthEndpoint = pathname === '/api/admin/auth'

    if (!isLoginPage && !isAuthEndpoint) {
      const secret = process.env.ADMIN_SESSION_SECRET
      const session = request.cookies.get('admin_session')?.value

      const authed = secret ? await verifySession(session, secret) : false

      if (!authed) {
        if (isAdminApi) {
          // API calls → 401 JSON
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        // Admin UI pages → redirect to login
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('next', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    // ── Robots header on all /admin routes ──────────────────────────────────
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
