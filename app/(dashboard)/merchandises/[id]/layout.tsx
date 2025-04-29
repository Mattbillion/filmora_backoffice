import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { checkPermission } from '@/lib/permission';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (
    checkPermission(session, [
      'get_company_merchandise',
      'update_company_merchandise',
      'delete_company_merchandise',
      'get_company_merchandise_attribute_option_value_list',
      'get_company_merchandise_attribute_option_value',
      'create_company_merchandise_attribute_option_value',
      'update_company_merchandise_attribute_option_value',
      'delete_company_merchandise_attribute_option_value',
    ])
  )
    return children;
  return notFound();
}
