import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const transactionSchema = z.object({
  order_id: z.number(),
  user_id: z.string(),
  transaction_amount: z.number(),
  transaction_status: z.string(),
  payment_method: z.null(),
  transaction_date: z.null(),
});

export type TransactionBodyType = z.infer<typeof transactionSchema>;

export type TransactionItemType = PrettyType<BaseType<TransactionBodyType>>;

export const RVK_TRANSACTION = 'transaction';
