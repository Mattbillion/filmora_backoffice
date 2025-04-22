import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const transactionsSchema = z.object({
  order_id: z.number(),
  user_id: z.string(),
  transaction_amount: z.number(),
  transaction_status: z.string(),
  payment_method: z.null(),
  transaction_date: z.null(),
});

export type TransactionsBodyType = z.infer<typeof transactionsSchema>;

export type TransactionsItemType = PrettyType<BaseType<TransactionsBodyType>>;

export const RVK_TRANSACTIONS = 'transactions';
