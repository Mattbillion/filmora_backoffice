import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { checkPermission } from '@/lib/permission';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (
    checkPermission(session, [
      'get_template_list',
      'create_template',
      'delete_template',
    ])
  )
    return children;
  return notFound();
}
