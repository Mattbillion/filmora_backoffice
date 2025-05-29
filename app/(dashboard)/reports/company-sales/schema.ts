import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const companySalesSchema = z.object({
  order_date: z.string(),
  seats_quantity: z.number(),
  merch_quantity: z.number(),
  seats_sales_amount: z.number(),
  merch_sales_amount: z.number(),
  total_sales_amount: z.number(),
});

export type CompanySalesBodyType = z.infer<typeof companySalesSchema>;

export type CompanySalesItemType = PrettyType<BaseType<CompanySalesBodyType>>;

export const RVK_COMPANY_SALES = 'company-sales';
