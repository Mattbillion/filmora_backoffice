/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "./auth.config";
import { xooxFetch } from "@/lib/fetch";
import { ID } from "@/lib/fetch/types";
import { roleMap } from "@/lib/permission";

type LoginResType = {
  token: string;
  refreshToken: string;
  employee: {
    id: ID;
    created_at: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    role: number;
    created_by: ID | null;
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
        
        const { body } = await xooxFetch<{data: LoginResType}>(
          "login",
          {
            method: "POST",
            body: {
              username,
              password,
            },
            cache: "no-store"
          },
        );

        if(body?.data?.token)
          return {
            email: body?.data?.employee?.email,
            role: body?.data?.employee?.role,
            id: body?.data?.token,
          };

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = (roleMap as any)[user.role] ?? "content";
        // backend dr rotate token hiigdeegvi tul hvcheer zaaj uguw.
        // token.exp = getExpDateFromJWT(token.id).toISOString();
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: any;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
      }
      // if(token.exp) session.expires = token.exp;
      
      return session;
    },
  },
  // session: {
  //   strategy: "jwt",
  //   // rotate token integrate hiiwel ustgaarai
  //   maxAge: 24 * 60 * 60,
  // },
});

// function getExpDateFromJWT(token: string): Date {
//   const fallbackDate = new Date();
//   fallbackDate.setDate(fallbackDate.getDate() + 1);

//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = JSON.parse(
//       Buffer.from(base64, 'base64').toString('utf-8')
//     );

//     if (!jsonPayload.exp) return fallbackDate;

//     return new Date(jsonPayload.exp * 1000);
//   } catch (error) {
//     console.error('Error decoding JWT:', error);
//     return fallbackDate;
//   }
// }
