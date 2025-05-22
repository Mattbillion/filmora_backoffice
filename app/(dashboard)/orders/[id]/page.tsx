import { notFound } from 'next/navigation';

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

  return <OrderDetailClient order={order} />;
}
