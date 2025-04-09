import { ReactNode } from 'react';

// import { notFound } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';
import { checkPermission } from '@/lib/permission';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (checkPermission(session, ['company_merchandise_list'])) return children;
  // return notFound();
  return children; // TODO: tvr zuur
}
