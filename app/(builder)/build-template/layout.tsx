import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { checkPermission } from '@/lib/permission';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  const canAccess = checkPermission(session, ['create_template']) || true;

  if (canAccess) return children;
  return notFound();
}
