import { Suspense } from 'react';

import { MerchandiseDiscountSalesChart } from '@/app/(dashboard)/reports/charts/merch-discount-sale-chart';
import { SearchParams } from '@/lib/fetch/types';

import { getMerchandiseDiscountSales } from './actions';

export const dynamic = 'force-dynamic';

export default async function MerchandiseDiscountSalesPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { data } = await getMerchandiseDiscountSales();

  const chartData = mockData || data?.data;

  return (
    <>
      <Suspense fallback="Loading">
        <MerchandiseDiscountSalesChart chartData={chartData} />
      </Suspense>
    </>
  );
}

const mockData = [
  {
    merchandise_id: 101,
    mer_name: 'Opozit BOLOT TSOM t-shirt #1',
    discount_id: 32,
    discount_name: 'Opening sale',
    discount_type: 'AMOUNT',
    discount: 10000,
    discounted_item_count: 41,
    total_quantity_sold: 41,
    original_total_price: 2954296,
    discounted_total_price: 2544296,
    total_discount_amount: 410000,
  },
  {
    merchandise_id: 102,
    mer_name: 'Ochiroo test2 #2',
    discount_id: 32,
    discount_name: 'Opening sale',
    discount_type: 'PERCENT',
    discount: 10,
    discounted_item_count: 32,
    total_quantity_sold: 32,
    original_total_price: 1468064,
    discounted_total_price: 1321280,
    total_discount_amount: 146784,
  },
  {
    merchandise_id: 103,
    mer_name: 'Ochiroo test2 #3',
    discount_id: 32,
    discount_name: 'Opening sale',
    discount_type: 'PERCENT',
    discount: 10,
    discounted_item_count: 37,
    total_quantity_sold: 37,
    original_total_price: 1926960,
    discounted_total_price: 1734264,
    total_discount_amount: 192696,
  },
  {
    merchandise_id: 104,
    mer_name: 'Opozit BOLOT TSOM t-shirt #4',
    discount_id: 32,
    discount_name: 'Opening sale',
    discount_type: 'AMOUNT',
    discount: 10000,
    discounted_item_count: 34,
    total_quantity_sold: 34,
    original_total_price: 2260116,
    discounted_total_price: 1920116,
    total_discount_amount: 340000,
  },
  {
    merchandise_id: 105,
    mer_name: 'Ochiroo test2 #5',
    discount_id: 32,
    discount_name: 'Opening sale',
    discount_type: 'PERCENT',
    discount: 10,
    discounted_item_count: 6,
    total_quantity_sold: 6,
    original_total_price: 477426,
    discounted_total_price: 429684,
    total_discount_amount: 47742,
  },
];
