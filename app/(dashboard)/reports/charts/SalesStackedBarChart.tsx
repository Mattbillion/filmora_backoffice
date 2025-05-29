'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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

export const SalesStackedBarChart = ({ data }: { data: any }) => {
  const chartConfig = {
    seats_sales_amount: {
      label: 'Seat Sales',
      color: 'hsl(var(--chart-1))', // Sapphire primary
    },
    merch_sales_amount: {
      label: 'Merch Sales',
      color: 'hsl(var(--chart-2))', // Sapphire secondary
    },
    total_sales_amount: {
      label: 'Total sales',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Борлуулалтын тайлан</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[256px] w-full">
          <BarChart accessibilityLayer data={salesData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="order_date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(5)} // shows "05-25"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="seats_sales_amount"
              stackId="a"
              fill="var(--color-seats_sales_amount)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="merch_sales_amount"
              stackId="a"
              fill="var(--color-merch_sales_amount)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="total_sales_amount"
              stackId="a"
              fill="var(--color-total_sales_amount)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

const salesData = [
  { order_date: '2025-05-01', seats_sales_amount: 10, merch_sales_amount: 160 },
  { order_date: '2025-05-02', seats_sales_amount: 40, merch_sales_amount: 150 },
  { order_date: '2025-05-03', seats_sales_amount: 10, merch_sales_amount: 0 },
  { order_date: '2025-05-04', seats_sales_amount: 60, merch_sales_amount: 90 },
  { order_date: '2025-05-05', seats_sales_amount: 50, merch_sales_amount: 20 },
  { order_date: '2025-05-06', seats_sales_amount: 75, merch_sales_amount: 100 },
  { order_date: '2025-05-07', seats_sales_amount: 0, merch_sales_amount: 30 },
  { order_date: '2025-05-08', seats_sales_amount: 45, merch_sales_amount: 60 },
  { order_date: '2025-05-09', seats_sales_amount: 60, merch_sales_amount: 0 },
  { order_date: '2025-05-10', seats_sales_amount: 40, merch_sales_amount: 40 },
  { order_date: '2025-05-11', seats_sales_amount: 80, merch_sales_amount: 80 },
  { order_date: '2025-05-12', seats_sales_amount: 0, merch_sales_amount: 60 },
  { order_date: '2025-05-13', seats_sales_amount: 60, merch_sales_amount: 200 },
  { order_date: '2025-05-14', seats_sales_amount: 15, merch_sales_amount: 0 },
  { order_date: '2025-05-15', seats_sales_amount: 60, merch_sales_amount: 90 },
  { order_date: '2025-05-16', seats_sales_amount: 0, merch_sales_amount: 90 },
  { order_date: '2025-05-17', seats_sales_amount: 60, merch_sales_amount: 120 },
  { order_date: '2025-05-18', seats_sales_amount: 60, merch_sales_amount: 20 },
  { order_date: '2025-05-19', seats_sales_amount: 75, merch_sales_amount: 0 },
  { order_date: '2025-05-20', seats_sales_amount: 15, merch_sales_amount: 120 },
  { order_date: '2025-05-21', seats_sales_amount: 60, merch_sales_amount: 120 },
  { order_date: '2025-05-22', seats_sales_amount: 30, merch_sales_amount: 150 },
  { order_date: '2025-05-23', seats_sales_amount: 30, merch_sales_amount: 40 },
  { order_date: '2025-05-24', seats_sales_amount: 60, merch_sales_amount: 30 },
  { order_date: '2025-05-25', seats_sales_amount: 20, merch_sales_amount: 120 },
  { order_date: '2025-05-26', seats_sales_amount: 0, merch_sales_amount: 80 },
  { order_date: '2025-05-27', seats_sales_amount: 15, merch_sales_amount: 200 },
  { order_date: '2025-05-28', seats_sales_amount: 60, merch_sales_amount: 20 },
  { order_date: '2025-05-29', seats_sales_amount: 0, merch_sales_amount: 0 },
  { order_date: '2025-05-30', seats_sales_amount: 20, merch_sales_amount: 40 },
  { order_date: '2025-05-31', seats_sales_amount: 30, merch_sales_amount: 120 },
  { order_date: '2025-06-01', seats_sales_amount: 60, merch_sales_amount: 80 },
  { order_date: '2025-06-02', seats_sales_amount: 50, merch_sales_amount: 30 },
  { order_date: '2025-06-03', seats_sales_amount: 40, merch_sales_amount: 100 },
  { order_date: '2025-06-04', seats_sales_amount: 20, merch_sales_amount: 60 },
  { order_date: '2025-06-05', seats_sales_amount: 20, merch_sales_amount: 150 },
  { order_date: '2025-06-06', seats_sales_amount: 20, merch_sales_amount: 30 },
  { order_date: '2025-06-07', seats_sales_amount: 0, merch_sales_amount: 0 },
];
