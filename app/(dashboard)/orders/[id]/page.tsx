import { notFound } from 'next/navigation';

import { ReplaceBreadcrumdItem } from '@/components/custom/replace-breadcrumd-item';

import { getOrdersDetail } from '../actions';
import OrderDetailClient from './client';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await getOrdersDetail(id);
  const order = data?.data;

  if (!order) return notFound();

  return (
    <>
      <ReplaceBreadcrumdItem
        data={{
          orders: {
            value: order.order_number,
            selector: id,
          },
        }}
      />
      <OrderDetailClient order={order} />
    </>
  );
}
