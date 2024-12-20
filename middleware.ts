import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/']; 
  
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  // Check if we're on an API route
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const user = await verifyAuth(token);
    
    // Clone the request headers and add the user information
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-role', user.role);

    // Create a new request with the modified headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    return response;
  } catch (error) {
    if (isApiRoute) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/** (authentication endpoints)
     * 2. /_next/** (Next.js internals)
     * 3. /static/** (static files)
     * 4. /favicon.ico, /sitemap.xml (public files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};