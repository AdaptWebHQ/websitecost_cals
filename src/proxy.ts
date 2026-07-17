import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_TOKEN = 'webcost_session_token';
const COOKIE_ROLE = 'webcost_user_role';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth cookies
  const token = request.cookies.get(COOKIE_TOKEN)?.value;
  const role = request.cookies.get(COOKIE_ROLE)?.value;

  const isAuthenticated = !!token;

  // 1. Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Protect dashboard, admin, and public routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/public')) {
    if (!isAuthenticated) {
      // Redirect unauthenticated users to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Unify entry points to '/dashboard'
    if (pathname === '/admin' || pathname === '/public') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Protect admin sub-routes
    if (pathname.startsWith('/admin/')) {
      if (role !== 'admin' && role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Protect public sub-routes
    if (pathname.startsWith('/public/')) {
      if (role === 'admin' || role === 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/public/:path*', '/login', '/register'],
};
