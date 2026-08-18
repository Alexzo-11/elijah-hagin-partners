import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip API routes and static files
  if (pathname.startsWith('/api') || 
      pathname.includes('/_next/') || 
      pathname.includes('/favicon.ico')) {
    return NextResponse.next();
  }

  // Public paths
  const publicPaths = ['/', '/login', '/register', '/forgot-password'];
  const publicPrefixes = ['/reset-password/', '/verify-email/'];
  
  const isPublic = publicPaths.includes(pathname) || 
                   publicPrefixes.some(prefix => pathname.startsWith(prefix));
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  let user = null;
  
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      user = payload;
      console.log('Middleware - User:', user);
    } catch (e) {
      console.log('Middleware - Invalid token:', e.message);
    }
  }

  // If no token and trying to access protected route
  if (!isPublic && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // If authenticated and trying to access login/register
  if (user && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
    console.log('Middleware - Redirecting to:', user.role === 'admin' ? '/admin' : '/partner');
    const dashboard = user.role === 'admin' ? '/admin' : '/partner';
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // Role-based protection
  if (user) {
    // If admin tries to access partner routes
    if (user.role === 'admin' && pathname.startsWith('/partner')) {
      console.log('Middleware - Admin accessing partner, redirecting to admin');
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // If partner tries to access admin routes
    if (user.role === 'partner' && pathname.startsWith('/admin')) {
      console.log('Middleware - Partner accessing admin, redirecting to partner');
      return NextResponse.redirect(new URL('/partner', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
};