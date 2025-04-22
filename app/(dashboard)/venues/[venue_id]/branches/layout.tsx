import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { checkPermission } from '@/lib/permission';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (
    checkPermission(session, [
      'get_branch_list',
      'get_branch',
      'create_branch',
      'update_branch',
      'delete_branch',
    ])
  )
    return children;
  return notFound();
}
