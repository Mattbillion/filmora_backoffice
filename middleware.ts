import { NextRequest } from 'next/server';

import { auth } from './app/(auth)/auth';

export default auth(async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
  console.log(req.nextUrl.pathname);
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
