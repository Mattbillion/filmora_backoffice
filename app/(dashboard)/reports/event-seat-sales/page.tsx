import { auth } from '@/app/(auth)/auth';
import { MultipleLineChart } from '@/app/(dashboard)/reports/charts/MultipleLineChart';
import { ChartConfig } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/lib/fetch/types';

import { getEventSeatSalesDetail } from './actions';

export const dynamic = 'force-dynamic';

export default async function EventSeatSalesPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const { data } = await getEventSeatSalesDetail(28);

  // {
  //   "event_id": 28,
  //     "seat_id": 26875,
  //     "seat_no": "R2-s152-P5000-JS",
  //     "section_type": "seat",
  //     "order_date": "2025-05-27",
  //     "total_quantity": 1,
  //     "total_revenue": 10
  // }

  const chartConfig = {
    seats_sales_amount: {
      label: 'Тасалбар',
      color: 'hsl(var(--chart-1))',
    },
    merch_sales_amount: {
      label: 'Мерчидайз бараа',
      color: 'hsl(var(--chart-2))',
    },
    total_sales_amount: {
      label: 'Нийт борлуулалтын дүн',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <>
      {/*<div className="flex items-start justify-between">*/}
      {/*  <Heading*/}
      {/*    title={`Event seat sales list (${data?.total_count ?? data?.data?.length})`}*/}
      {/*  />*/}
      {/*</div>*/}
      <Separator />
      <MultipleLineChart
        data={data?.data || []}
        chartConfig={chartConfig}
        xAxisKey={'order_date'}
      />
    </>
  );
}
