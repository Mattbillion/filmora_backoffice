import { NextAuthConfig } from 'next-auth';

import { menuData, SubMenuItemType } from '@/components/constants/menu';

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user?.id;
      const pathname = nextUrl.pathname;
      const isAuthRoute =
        pathname.startsWith('/register') || pathname.startsWith('/login');
      // route ingej shalgahgvi bol assets uri dr buruu uri butsna shvv.
      const isSomewhere = [{ url: '/' } as SubMenuItemType]
        .concat(...Object.values(menuData))
        .some((c) =>
          c.subRoutes ? pathname.startsWith(c.url) : c.url === pathname,
        );

      if (isLoggedIn && isAuthRoute)
        return Response.redirect(new URL('/', nextUrl));

      if (!isLoggedIn && isSomewhere)
        return Response.redirect(new URL('/login', nextUrl));

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
