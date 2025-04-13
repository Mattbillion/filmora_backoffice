import { ReactNode } from 'react';
// import { hasPagePermission, Role } from "@/lib/permission";
// import { User } from "next-auth";
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { permissionsByRoute } from '@/components/constants/menu';
import { checkPermission } from '@/lib/permission';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (checkPermission(session, permissionsByRoute.role)) return children;
  return notFound();
}
