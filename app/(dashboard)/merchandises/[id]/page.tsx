import { notFound } from 'next/navigation';

import { getEventsHash } from '@/app/(dashboard)/events/actions';
import { getMerchandiseDetail } from '@/app/(dashboard)/merchandises/actions';
import { getHierarchicalComCat } from '@/features/category/actions';
import { getDiscounts } from '@/features/discounts/actions';

import MerchDetailClient from './client';

export default async function MerchandiseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [
    { data },
    { data: categoriesData },
    { data: discountsData },
    eventsData,
  ] = await Promise.all([
    getMerchandiseDetail(id),
    getHierarchicalComCat(),
    getDiscounts(),
    getEventsHash().then(
      (res) =>
        Object.entries(res?.data || {}).map(([i, n]) => ({
          id: i,
          name: n,
        })) as any,
    ),
  ]);
  const merchData = data?.data;

  if (!merchData) return notFound();

  return (
    <MerchDetailClient
      initialData={merchData}
      categories={categoriesData}
      discounts={discountsData?.data}
      events={eventsData}
    />
  );
}
