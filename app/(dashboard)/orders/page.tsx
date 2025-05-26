import { Suspense } from 'react';

import { auth } from '@/app/(auth)/auth';
import { DateRangeFilter } from '@/components/custom/date-range-filter';
import { Heading } from '@/components/custom/heading';
import StatusFilter from '@/components/custom/table/status-filter';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { getOrders } from './actions';
import { ordersColumns } from './columns';

export const dynamic = 'force-dynamic';

export default async function OrdersPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const { data } = await getOrders({
    ...searchParams,
    com_id: session?.user?.company_id,
  });

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Orders list (${data?.total_count ?? data?.data?.length})`}
        />
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={ordersColumns}
          data={data?.data?.map((c) => ({
            ...c,
            canModify: checkPermission(session, ['get_order_detail']),
          }))}
          rowCount={data?.total_count ?? data?.data?.length}
        >
          <div className="flex items-center gap-2">
            <StatusFilter
              name={'status'}
              options={[
                {
                  value: 'cancelled',
                  label: 'Cancelled',
                },
                {
                  value: 'pending',
                  label: 'Pending',
                },
                {
                  value: 'completed',
                  label: 'Completed',
                },
              ]}
            />
            <DateRangeFilter fieldNames={['start_date', 'end_date']} />
          </div>
        </DataTable>
      </Suspense>
    </>
  );
}
