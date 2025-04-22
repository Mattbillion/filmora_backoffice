import { Suspense } from 'react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/lib/fetch/types';

import { getTransactions } from './actions';
import { transactionsColumns } from './columns';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const { data } = await getTransactions({
    ...searchParams,
    company_id: session?.user?.company_id,
  });

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Transactions list (${data?.total_count ?? data?.data?.length})`}
        />
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={transactionsColumns}
          data={data?.data}
          rowCount={data?.total_count ?? data?.data?.length}
        />
      </Suspense>
    </>
  );
}
