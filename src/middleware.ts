// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   // TODO: enable and ignore for admin user
//   // return NextResponse.redirect(new URL('/', request.url));
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ['/admin/:path*'],
// };

export { auth as default } from './auth';

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
