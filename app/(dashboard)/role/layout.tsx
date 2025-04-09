import { ReactNode } from 'react';
// import { hasPagePermission, Role } from "@/lib/permission";
// import { User } from "next-auth";
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (session?.user?.permissions?.includes('get_role_list')) return children;
  return notFound();
}
