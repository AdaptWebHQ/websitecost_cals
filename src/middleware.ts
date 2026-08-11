import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const role = request.cookies.get('webcost_user_role')?.value;
  const token = request.cookies.get('webcost_session_token')?.value;

  // If user is not logged in, let the (protected) layout redirect to /login
  if (!token) {
    return NextResponse.next();
  }

  // If a non-admin tries to access admin routes, redirect to /unauthorized
  if (pathname.startsWith('/admin')) {
    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // If an admin tries to access public customer routes, redirect to /unauthorized
  if (pathname.startsWith('/public')) {
    if (role === 'admin' || role === 'super_admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/public/:path*',
  ],
};
