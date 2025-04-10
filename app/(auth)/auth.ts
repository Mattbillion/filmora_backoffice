/* eslint-disable @typescript-eslint/no-explicit-any */
import { omit } from 'lodash';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getCompany } from '@/features/companies/actions';
import {
  getAssignedPermission,
  getPermissionList,
} from '@/features/permission/actions';
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
      company_name: string | null;
      company_register: string | null;
      company_logo: string | null;
      status: string | null;
      last_logged_at: string | null;
      created_at: string | null;
      updated_at: string | null;
      created_employee: number | null;
      permissions: string[];
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

          const [
            { data: permissionListData },
            { data: assignedPermissionData },
            { data: companyRes },
          ] = await Promise.all([
            getPermissionList(
              { page_size: 10000 },
              {
                Authorization: `Bearer ${body.access_token}`,
              },
            ),
            getAssignedPermission({
              Authorization: `Bearer ${body.access_token}`,
            }),
            userData.company_id
              ? getCompany(userData.company_id)
              : Promise.resolve({ data: null, error: null }),
          ]);
          const companyInfo = companyRes?.data;

          return {
            company_name: companyInfo?.company_name,
            company_register: companyInfo?.company_register,
            company_logo: companyInfo?.company_logo,
            ...userData,
            permissions: assignedPermissionData.data.map(
              (c) =>
                permissionListData.data.find(
                  (cc) => cc.id === Number(c.permission_id),
                )?.permission_name,
            ),
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
        return Object.assign(token || {}, user);
      } else if (new Date() < new Date(token.expires_at)) {
        return Object.assign(
          token,
          trigger === 'update' ? omit(session.user, 'id') : {},
        );
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
            refresh_token: body.refresh_token || token.refresh_token,
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
