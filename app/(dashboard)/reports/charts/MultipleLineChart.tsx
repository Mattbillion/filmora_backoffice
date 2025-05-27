'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
// const chartData = [
//   { month: 'January', desktop: 186, mobile: 80 },
//   { month: 'February', desktop: 305, mobile: 200 },
//   { month: 'March', desktop: 237, mobile: 120 },
//   { month: 'April', desktop: 73, mobile: 190 },
//   { month: 'May', desktop: 209, mobile: 130 },
//   { month: 'June', desktop: 214, mobile: 140 },
// ];

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

export const MultipleLineChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[256px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="order_date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="seats_sales_amount"
              type="monotone"
              stroke="var(--color-seats_sales_amount)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="merch_sales_amount"
              type="monotone"
              stroke="var(--color-merch_sales_amount)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="total_sales_amount"
              type="monotone"
              stroke="var(--color-total_sales_amount)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

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
