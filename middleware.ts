import { auth } from '@/auth';

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isAuth =
    ['/login', '/logout'].includes(path) || path.startsWith('/api/auth');

  if (!req.auth && !isAuth && path.startsWith('/')) {
    const newUrl = new URL('/login', req.nextUrl.origin);
    return Response.redirect(newUrl);
  } else if (req.auth && isAuth) {
    const newUrl = new URL('/', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
  return;
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
