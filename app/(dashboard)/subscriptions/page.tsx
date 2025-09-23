import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { Heading } from '@/components/custom/heading';
import { Button, buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/services/api/types';

import { subscriptionsColumns } from './columns';
import { auth } from '@/app/(auth)/auth';
import { checkPermission } from '@/lib/permission';

export const dynamic = 'force-dynamic';

export default async function SubscriptionsPage(props: {
  searchParams?: SearchParams<>;
}) {
  const session = await auth();

  const list = data?.data || []; // Check and fix, its generated and might be dumb
  const count = data?.total_count ?? list.length; // Check and fix, its generated and might be dumb

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Subscriptions list (${count})`} />
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={subscriptionsColumns}
          data={list}
          rowCount={count}
        />
      </Suspense>
    </>
  );
}
