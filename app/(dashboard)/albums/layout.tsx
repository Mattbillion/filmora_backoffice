import { notFound } from 'next/navigation';
import { User } from 'next-auth';

import { auth } from '@/app/(auth)/auth';
import { hasPagePermission, Role } from '@/lib/permission';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (
    hasPagePermission((session?.user as User & { role: Role })?.role, 'albums')
  )
    return children;
  return notFound();
}
