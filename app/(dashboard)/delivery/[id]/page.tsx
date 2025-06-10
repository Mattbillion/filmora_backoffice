import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { checkPermission } from '@/lib/permission';

import { getDelivery } from '../actions';
import { deliveryColumns } from './columns';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const { data } = await getDelivery(id);
  const order = data?.data;

  if (!order) return notFound();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Delivery list (${data?.total_count ?? data?.data?.length})`}
        />
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={deliveryColumns}
          data={data?.data?.map((c) => ({
            ...c,
            canModify: checkPermission(session, ['get_order_detail']),
          }))}
          rowCount={data?.total_count ?? data?.data?.length}
        />
      </Suspense>
    </>
  );
}
