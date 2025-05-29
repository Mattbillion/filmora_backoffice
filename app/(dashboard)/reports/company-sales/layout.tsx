import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { checkPermission } from '@/lib/permission';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (checkPermission(session, ['get_company_category'])) return children;
  return notFound();
}
