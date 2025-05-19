import { notFound } from 'next/navigation';

import { getMerchandiseDetail } from '@/app/(dashboard)/merchandises/actions';
import { getHierarchicalCategories } from '@/features/category/actions';
import { getDiscounts } from '@/features/discounts/actions';

import MerchDetailClient from './client';

export default async function MerchandiseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ data }, { data: categoriesData }, { data: discountsData }] =
    await Promise.all([
      getMerchandiseDetail(id),
      getHierarchicalCategories(),
      getDiscounts(),
    ]);
  const merchData = data?.data;
  console.log(data);
  if (!merchData) return notFound();

  return (
    <MerchDetailClient
      initialData={merchData}
      categories={categoriesData}
      discounts={discountsData?.data}
    />
  );
}
