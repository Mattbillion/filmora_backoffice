import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { checkPermission } from '@/lib/permission';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (
    checkPermission(session, [
      'create_bosoo_seat',
      'update_bosoo_seat',
      'delete_bosoo_seat',
      'get_bosoo_seats',
    ])
  )
    return children;
  return notFound();
}
