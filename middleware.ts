import NextAuth from "next-auth";
import { authConfig } from "./app/(auth)/auth.config";
import { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
  console.log(req.nextUrl.pathname);
});
