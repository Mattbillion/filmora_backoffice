'use client';

import { useEffect } from 'react';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from 'recharts';

import { getEventsHash } from '@/app/(dashboard)/events/actions';
import { CustomTooltip } from '@/app/(dashboard)/reports/charts/CustomToolTip';
import { SelectEvent } from '@/app/(dashboard)/reports/event-merchandise-sales/components/SelectEvent';
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

export const EventMerchandiseSalesChart = ({
  data,
  cConfig,
  xAxisKey,
  showLegends = false,
}: {
  data: any;
  cConfig: any;
  xAxisKey: string;
  showLegends?: boolean;
}) => {
  const chartConfig: ChartConfig = cConfig;
  const router = useRouter();

  const [eventList, setEventList] = React.useState<Record<number, string>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEventsHash();
        if (res?.data) {
          setEventList(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch event hash:', error);
      }
    };

    fetchData();
  }, []);

  if (data.length < 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full">
          <div className="w-full space-y-1">
            <CardTitle>Эвентын мерчиндайз борлуулалт</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </div>
          <div>
            <SelectEvent
              eventList={eventList}
              selectedValue={(c) => router.replace(`?eventId=${c}`)}
              defaultValue={''}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[256px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <XAxis
              tickSize={6}
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => value}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {showLegends && <ChartLegend content={<ChartLegendContent />} />}
            {Object.entries(cConfig).map(([key, { color, label }]: any) => {
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={color}
                  stackId="a"
                  label={label}
                />
              );
            })}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

type ChartLineType = {};

const data = [
  {
    order_date: '2025-05-01',
    seats_quantity: 3,
    merch_quantity: 1,
    seats_sales_amount: 30,
    merch_sales_amount: 40,
    total_sales_amount: 70,
  },
  {
    order_date: '2025-05-02',
    seats_quantity: 2,
    merch_quantity: 2,
    seats_sales_amount: 20,
    merch_sales_amount: 70,
    total_sales_amount: 90,
  },
  {
    order_date: '2025-05-03',
    seats_quantity: 5,
    merch_quantity: 0,
    seats_sales_amount: 50,
    merch_sales_amount: 0,
    total_sales_amount: 50,
  },
  {
    order_date: '2025-05-04',
    seats_quantity: 6,
    merch_quantity: 1,
    seats_sales_amount: 60,
    merch_sales_amount: 35,
    total_sales_amount: 95,
  },
  {
    order_date: '2025-05-05',
    seats_quantity: 1,
    merch_quantity: 3,
    seats_sales_amount: 10,
    merch_sales_amount: 90,
    total_sales_amount: 100,
  },
  {
    order_date: '2025-05-06',
    seats_quantity: 0,
    merch_quantity: 4,
    seats_sales_amount: 0,
    merch_sales_amount: 100,
    total_sales_amount: 100,
  },
  {
    order_date: '2025-05-07',
    seats_quantity: 2,
    merch_quantity: 1,
    seats_sales_amount: 20,
    merch_sales_amount: 25,
    total_sales_amount: 45,
  },
  {
    order_date: '2025-05-08',
    seats_quantity: 4,
    merch_quantity: 1,
    seats_sales_amount: 40,
    merch_sales_amount: 35,
    total_sales_amount: 75,
  },
  {
    order_date: '2025-05-09',
    seats_quantity: 1,
    merch_quantity: 2,
    seats_sales_amount: 10,
    merch_sales_amount: 50,
    total_sales_amount: 60,
  },
  {
    order_date: '2025-05-10',
    seats_quantity: 5,
    merch_quantity: 0,
    seats_sales_amount: 50,
    merch_sales_amount: 0,
    total_sales_amount: 50,
  },
  {
    order_date: '2025-05-11',
    seats_quantity: 4,
    merch_quantity: 3,
    seats_sales_amount: 40,
    merch_sales_amount: 75,
    total_sales_amount: 115,
  },
  {
    order_date: '2025-05-12',
    seats_quantity: 2,
    merch_quantity: 2,
    seats_sales_amount: 20,
    merch_sales_amount: 55,
    total_sales_amount: 75,
  },
  {
    order_date: '2025-05-13',
    seats_quantity: 3,
    merch_quantity: 0,
    seats_sales_amount: 30,
    merch_sales_amount: 0,
    total_sales_amount: 30,
  },
  {
    order_date: '2025-05-14',
    seats_quantity: 2,
    merch_quantity: 4,
    seats_sales_amount: 20,
    merch_sales_amount: 90,
    total_sales_amount: 110,
  },
  {
    order_date: '2025-05-15',
    seats_quantity: 0,
    merch_quantity: 5,
    seats_sales_amount: 0,
    merch_sales_amount: 125,
    total_sales_amount: 125,
  },
  {
    order_date: '2025-05-16',
    seats_quantity: 1,
    merch_quantity: 1,
    seats_sales_amount: 10,
    merch_sales_amount: 30,
    total_sales_amount: 40,
  },
  {
    order_date: '2025-05-17',
    seats_quantity: 5,
    merch_quantity: 2,
    seats_sales_amount: 50,
    merch_sales_amount: 55,
    total_sales_amount: 105,
  },
  {
    order_date: '2025-05-18',
    seats_quantity: 6,
    merch_quantity: 1,
    seats_sales_amount: 60,
    merch_sales_amount: 40,
    total_sales_amount: 100,
  },
  {
    order_date: '2025-05-19',
    seats_quantity: 1,
    merch_quantity: 2,
    seats_sales_amount: 10,
    merch_sales_amount: 60,
    total_sales_amount: 70,
  },
  {
    order_date: '2025-05-20',
    seats_quantity: 3,
    merch_quantity: 3,
    seats_sales_amount: 30,
    merch_sales_amount: 80,
    total_sales_amount: 110,
  },
  {
    order_date: '2025-05-21',
    seats_quantity: 2,
    merch_quantity: 2,
    seats_sales_amount: 20,
    merch_sales_amount: 50,
    total_sales_amount: 70,
  },
  {
    order_date: '2025-05-22',
    seats_quantity: 4,
    merch_quantity: 0,
    seats_sales_amount: 40,
    merch_sales_amount: 0,
    total_sales_amount: 40,
  },
];
