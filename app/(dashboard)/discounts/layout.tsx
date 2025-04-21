import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { permissionsByRoute } from '@/components/constants/menu';
import { checkPermission } from '@/lib/permission';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (checkPermission(session, permissionsByRoute['discounts'] || []))
    return children;
  return notFound();
}
