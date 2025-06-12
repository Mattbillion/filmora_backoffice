'use client';

import { currencyFormat } from '@interpriz/lib';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from 'recharts';

import { MerchDiscountSaleTooltip } from '@/app/(dashboard)/reports/charts/merch-discount-sale/tooltip';
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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function MerchandiseDiscountSalesChart({
  chartData = [],
}: {
  chartData: any;
}) {
  const totalRevenue = chartData.reduce(
    (acc: any, item: any) => acc + item.discounted_total_price,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Хямдралтай мерчиндайз</CardTitle>
            <CardDescription>Нийт борлуулалт мерч тус бүрээр</CardDescription>
          </div>
          <div className="flex flex-col gap-1 font-medium">
            <span className="text-xs text-muted-foreground">Нийт орлого</span>
            <span className="text-2xl font-bold">
              {currencyFormat(totalRevenue)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[354px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <Tooltip content={<MerchDiscountSaleTooltip />} />
            <XAxis
              dataKey="mer_name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              className="font-bold"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="total_quantity_sold"
              fill="var(--color-desktop)"
              name="Total quantity sold"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
