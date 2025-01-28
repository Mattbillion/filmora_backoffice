/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { xooxFetch } from '@/lib/fetch';

import { authConfig } from './auth.config';

type LoginResType = {
  access_token: string;
  refresh_token: string;
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ username, password }: any) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const { body } = await xooxFetch<LoginResType>(
          'auth/employee-login',
          {
            method: 'POST',
            body: formData,
            cache: 'no-store',
          },
        );

        if (body?.access_token)
          return {
            access_token: body.access_token,
            refresh_token: body.refresh_token,
            expires_at: getExpDateFromJWT(body.access_token),
            id: body.access_token,
          };

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      // if (user) {
      //   token.id = user.id;
      //   token.role = (roleMap as any)[user.role] ?? "content";
      // }
      if (user) {
        return {
          ...token,
          access_token: user.access_token,
          expires_at: user.expires_at,
          refresh_token: user.refresh_token,
        };
      } else if (Date.now() < token.expires_at * 1000) {
        return token;
      } else {
        try {
          if (!token.refresh_token)
            throw new TypeError('Missing refresh_token');
          const { body, error } = await xooxFetch<LoginResType>(
            '/auth/employee-refresh-token',
            {
              method: 'POST',
              body: {
                refresh_token: token.refresh_token,
              },
              cache: 'no-store',
            },
          );

          if (error) throw new Error(error);

          return {
            ...token,
            access_token: body.access_token,
            expires_at: getExpDateFromJWT(body.access_token),
            refresh_token: body.refresh_token
              ? body.refresh_token
              : token.refresh_token,
          };
        } catch (error) {
          console.error('Error refreshing access_token', error);
          token.error = 'RefreshTokenError';
          return token;
        }
      }
    },
    // async session({
    //   session,
    //   token,
    // }: {
    //   session: any;
    //   token: any;
    // }) {
    //   if (session.user) {
    //     session.user.id = token.id as string;
    //     session.user.role = token.role;
    //   }
    //
    //   return session;
    // },
  },
});

function getExpDateFromJWT(token: string): Date {
  const fallbackDate = new Date();
  fallbackDate.setDate(fallbackDate.getDate() + 1);

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = JSON.parse(
      Buffer.from(base64, 'base64').toString('utf-8'),
    );

    if (!jsonPayload.exp) return fallbackDate;

    return new Date(jsonPayload.exp * 1000);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return fallbackDate;
  }
}
