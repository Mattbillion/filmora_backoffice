import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const merchandiseDiscountSalesSchema = z.object({
  merchandise_id: z.number(),
  mer_name: z.string(),
  discount_id: z.number(),
  discount_name: z.string(),
  discount_type: z.string(),
  discount: z.number(),
  discounted_item_count: z.number(),
  total_quantity_sold: z.number(),
  original_total_price: z.number(),
  discounted_total_price: z.number(),
  total_discount_amount: z.number(),
});

export type MerchandiseDiscountSalesBodyType = z.infer<
  typeof merchandiseDiscountSalesSchema
>;

export type MerchandiseDiscountSalesItemType = PrettyType<
  BaseType<MerchandiseDiscountSalesBodyType>
>;

export const RVK_MERCHANDISE_DISCOUNT_SALES = 'merchandise-discount-sales';
