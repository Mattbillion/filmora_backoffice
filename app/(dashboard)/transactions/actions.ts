import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';

import { RVK_TRANSACTIONS, TransactionsItemType } from './schema';

export const getTransactions = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<TransactionsItemType[]>
    >('/transactions', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_TRANSACTIONS] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /transactions:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getTransactionsDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await xooxFetch<{ data: TransactionsItemType }>(
      `/transactions/${param1}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_TRANSACTIONS}_${param1}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /transactions/${param1}:`, error);
    return { data: null, error };
  }
};
