import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // if (!request.url.includes('/login') && !request.url.includes('/register')) {
  const jwt = request.cookies.get('jwt');
  console.log(jwt);
  if (!jwt) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/jury/:path*', '/account/:path*'],
};
