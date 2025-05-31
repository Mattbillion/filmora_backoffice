'use client';

import { uniqBy } from 'lodash';
import { useRouter } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { SelectEvent } from '@/app/(dashboard)/reports/event-seat-sales/component/SelectEvent';
import { EventSeatSalesItemType } from '@/app/(dashboard)/reports/event-seat-sales/schema';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  total_revenue: {
    label: 'total_revenue',
    color: 'hsl(var(--chart-1))',
  },
  total_sold: {
    label: 'total_sold',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function EventSeatSalesChart({
  chartData,
  eventId,
}: {
  chartData: EventSeatSalesItemType[];
  eventId: string;
}) {
  const router = useRouter();

  const eventList = uniqBy(chartData, 'event_id').map((d) => {
    return { event_id: d.event_id, event_name: d.event_name };
  });

  const cData = chartData?.reduce(
    (
      acc: { order_date: string; total_sold: number; total_revenue: number }[],
      cur: EventSeatSalesItemType,
    ) => {
      const found = acc?.find(
        (d: {
          order_date: string;
          total_sold: number;
          total_revenue: number;
        }) => d.order_date === cur.order_date,
      );

      if (found) {
        found.total_sold += cur.total_quantity;
        found.total_revenue += cur.total_revenue;
      } else {
        acc.push({
          order_date: cur.order_date,
          total_sold: cur.total_quantity,
          total_revenue: cur.total_revenue,
        });
      }
      return acc;
    },
    [] as {
      order_date: string;
      total_sold: number;
      total_revenue: number;
    }[],
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-full">
            <CardTitle>Bar Chart - Multiple</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </div>
          <SelectEvent
            eventList={eventList}
            selectedValue={(v) => router.replace(`?eventId=${v}`)}
            defaultValue={eventId || eventList[0]?.event_id.toString()}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={cData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="order_date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              color={'hsl(var(--chart-1))'}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent content={'dada'} />} />
            <Bar
              dataKey="total_revenue"
              fill={chartConfig.total_revenue.color}
              radius={4}
            />
            <Bar
              dataKey="total_sold"
              fill={chartConfig.total_sold.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
