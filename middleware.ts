import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {verifyAuth} from '@/lib/auth';

export async function middleware(request: NextRequest) {
   
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.next()
    }
    request.token = token;
}

export const config = {
    matcher: [
        '/api/:path*',
        '/dashboard/:path*',
        '/admin/:path*',
        '/events/:path*',
        '/events'
    ],
};