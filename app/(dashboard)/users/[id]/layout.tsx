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
  const withPermission = hasPagePermission(
    (session?.user as User & { role: Role })?.role,
    'users.detail',
  );

  if (withPermission) return children;
  return notFound();
}
