import { ReactNode } from 'react';
// import { auth } from "@/app/(auth)/auth";
// import { hasPagePermission, Role } from "@/lib/permission";
// import { User } from "next-auth";
// import { notFound } from "next/navigation";

export default async function Layout({ children }: { children: ReactNode }) {
  // const session = await auth();

  // if (
  //   hasPagePermission((session?.user as User & { role: Role })?.role, "banners")
  // )
  return children;
  // return notFound();
}
