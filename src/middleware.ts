import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_TOKEN = 'webcost_session_token';
const COOKIE_ROLE = 'webcost_user_role';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth cookies
  const token = request.cookies.get(COOKIE_TOKEN)?.value;
  const role = request.cookies.get(COOKIE_ROLE)?.value;

  const isAuthenticated = !!token;

  // 1. Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      // Redirect unauthenticated users to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based routing under '/dashboard' path itself
    if (pathname === '/dashboard') {
      if (role === 'admin' || role === 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard/public', request.url));
    }

    // Protect admin routes
    if (pathname.startsWith('/dashboard/admin')) {
      if (role !== 'admin' && role !== 'super_admin') {
        // Forbidden: redirect public users trying to access admin dashboard
        return NextResponse.redirect(new URL('/dashboard/public', request.url));
      }
    }

    // Protect public dashboard routes
    if (pathname.startsWith('/dashboard/public')) {
      if (role === 'admin' || role === 'super_admin') {
        // Redirect admins trying to access public dashboard to admin dashboard
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
