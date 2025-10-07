import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import { hasPagePermission } from '@/lib/permission';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (hasPagePermission(session, 'employees')) return children;
  return notFound();
}
