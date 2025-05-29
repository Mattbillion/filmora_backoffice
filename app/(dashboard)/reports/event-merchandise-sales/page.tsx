import { Suspense } from 'react';

import { EventMerchandiseSalesChart } from '@/app/(dashboard)/reports/charts/EventMerchandiseSalesChart';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/lib/fetch/types';

import { getEventMerchandiseSalesDetail } from './actions';

export const dynamic = 'force-dynamic';

export default async function EventMerchandiseSalesPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { data } = await getEventMerchandiseSalesDetail(
    searchParams?.eventId as string,
  );

  const chartData = data?.data || mockData;
  const chartDataArr = Array.isArray(chartData) ? chartData : [];

  const merchantNames = Array.from(
    new Set(chartDataArr.map((d) => d.mer_name.replace(/\s+/g, '_'))),
  );

  const colorPalette = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
  ];

  const chartConfig: Record<string, { label: string; color: string }> = {};

  merchantNames.forEach((name, index) => {
    const readableName = name.replace(/_/g, ' ');

    chartConfig[`${name}_quantity_sold`] = {
      label: `${readableName} - Зарагдсан`,
      color: colorPalette[(index * 2) % colorPalette.length],
    };

    chartConfig[`${name}_total_sales_amount`] = {
      label: `${readableName} - Орлого`,
      color: colorPalette[(index * 2 + 1) % colorPalette.length],
    };
  });

  const realData = data;

  const transformed = chartDataArr.reduce(
    (acc: any, item: any) => {
      const date = item.order_date;
      const name = item.mer_name.replace(/\s+/g, '_');

      if (!acc[date]) acc[date] = { order_date: date };

      acc[date][`${name}_quantity_sold`] = item.total_quantity_sold;
      acc[date][`${name}_total_sales_amount`] = item.total_sales_amount;

      return acc;
    },
    {} as Record<string, any>,
  );

  const result = Object.values(transformed);

  return (
    <>
      <Separator />
      <Suspense fallback="Loading">
        <EventMerchandiseSalesChart
          data={result}
          cConfig={chartConfig}
          xAxisKey="order_date"
          showLegends={false}
        />
      </Suspense>
    </>
  );
}

const mockData = [
  {
    event_id: 28,
    event_name: 'Test Event',
    merchandise_id: 66,
    mer_name: 'Opozit limited edition t-shirt',
    variant_id: 424,
    sku: 'SKU-66-428',
    total_quantity_sold: 256,
    total_sales_amount: 30720000,
    order_date: '2025-05-28',
  },
  {
    event_id: 28,
    event_name: 'Test Event',
    merchandise_id: 66,
    mer_name: 'Opozit limited edition Hoodie',
    variant_id: 424,
    sku: 'SKU-66-428',
    total_quantity_sold: 16,
    total_sales_amount: 3520000,
    order_date: '2025-05-28',
  },
  {
    event_id: 28,
    event_name: 'Test Event',
    merchandise_id: 66,
    mer_name: 'Opozit Sticker',
    variant_id: 424,
    sku: 'SKU-66-428',
    total_quantity_sold: 32,
    total_sales_amount: 3840000,
    order_date: '2025-05-28',
  },
  {
    event_id: 28,
    event_name: 'Test Event',
    merchandise_id: 88,
    mer_name: 'Opozit Sticker',
    variant_id: 423,
    sku: 'SKU-66-427',
    total_quantity_sold: 24,
    total_sales_amount: 1280000,
    order_date: '2025-05-26',
  },
  {
    event_id: 28,
    event_name: 'Test Event',
    merchandise_id: 66,
    mer_name: 'Opozit limited edition Hoodie',
    variant_id: 423,
    sku: 'SKU-66-422',
    total_quantity_sold: 50,
    total_sales_amount: 11000000,
    order_date: '2025-05-22',
  },
  {
    event_id: 28,
    event_name: 'Test Event',
    merchandise_id: 66,
    mer_name: 'Opozit limited edition Hoodie',
    variant_id: 422,
    sku: 'SKU-66-421',
    total_quantity_sold: 50,
    total_sales_amount: 11000000,
    order_date: '2025-05-10',
  },
  {
    event_id: 28,
    event_name: 'Test Event',
    merchandise_id: 66,
    mer_name: 'Opozit Sticker',
    variant_id: 423,
    sku: 'SKU-66-425',
    total_quantity_sold: 24,
    total_sales_amount: 1280000,
    order_date: '2025-05-06',
  },
  {
    event_id: 28,
    event_name: 'Test Event',
    merchandise_id: 66,
    mer_name: 'Opozit Sticker',
    variant_id: 425,
    sku: 'SKU-66-422',
    total_quantity_sold: 120,
    total_sales_amount: 873411,
    order_date: '2025-05-29',
  },
  {
    event_id: 28,
    event_name: 'Test Event',
    merchandise_id: 66,
    mer_name: 'Opozit limited edition t-shirt',
    variant_id: 422,
    sku: 'SKU-66-423',
    total_quantity_sold: 256,
    total_sales_amount: 30720000,
    order_date: '2025-05-31',
  },
];
