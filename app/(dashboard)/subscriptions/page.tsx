import { Suspense } from 'react';

import { Heading } from '@/components/custom/heading';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/services/api/types';
import { getSubscriptionUsers } from '@/services/subscriptions';

import { subscriptionsColumns } from './columns';

export const dynamic = 'force-dynamic';

export default async function SubscriptionsPage(props: {
  searchParams?: SearchParams<any>;
}) {
  const data = await getSubscriptionUsers();

  const list = data.data || []; // Check and fix, its generated and might be dumb
  const count = data?.total_count ?? list.length; // Check and fix, its generated and might be dumb

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Багцын хэрэглэгчид (${count})`} />
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
