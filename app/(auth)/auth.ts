/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { xooxFetch } from '@/lib/fetch';

import { authConfig } from './auth.config';

type LoginResType = {
  access_token: string;
  refresh_token: string;
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      role: 'Super_Admin' | string;
      firstname: string;
      lastname: string;
      phone: string | null;
      email: string | null;
      profile: string | null;
      email_verified: boolean;
      company_id: number | null;
      status: string | null;
      last_logged_at: string | null;
      created_at: string | null;
      updated_at: string | null;
      created_employee: number | null;
    };
  }
}

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

        const { body } = await xooxFetch<LoginResType>('auth/employee-login', {
          method: 'POST',
          body: formData,
          cache: 'no-store',
        });

        if (body?.access_token) {
          const { body: userInfo } = await xooxFetch('/employeeinfo', {
            headers: {
              Authorization: `Bearer ${body.access_token}`,
            },
          });

          const userData = userInfo.data || {};

          return {
            ...userData,
            access_token: body.access_token,
            refresh_token: body.refresh_token,
            expires_at: getExpDateFromJWT(body.access_token),
            id: body.access_token,
          } as any;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        return {
          ...token,
          access_token: user.access_token,
          expires_at: user.expires_at,
          refresh_token: user.refresh_token,
        };
      } else if (Date.now() < token.exp * 1000) {
        return Object.assign(token, trigger === 'update' ? session.user : {});
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
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user = {
          ...(token || {}),
          id: token.access_token as string,
        };
      }
      return session;
    },
  },
});

function getExpDateFromJWT(token: string): Date {
  const fallbackDate = new Date();
  fallbackDate.setDate(fallbackDate.getDate() + 1);

  try {
    const jsonPayload = extractJWT(token);

    if (!jsonPayload.exp) return fallbackDate;
    return new Date(jsonPayload.exp * 1000);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return fallbackDate;
  }
}

function extractJWT(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
}
