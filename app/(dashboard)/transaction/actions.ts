import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  RVK_TRANSACTION,
  TransactionBodyType,
  TransactionItemType,
} from './schema';

export const createTransaction = async (bodyData: TransactionBodyType) => {
  const { body, error } = await xooxFetch<{ data: TransactionItemType }>(
    'transactions',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_TRANSACTION]);
  return { data: body, error: null };
};

export const patchTransaction = async ({
  id,
  ...bodyData
}: TransactionBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: TransactionItemType }>(
    `/transactions/${id}`,
    {
      method: 'PATCH',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_TRANSACTION, `${RVK_TRANSACTION}_${id}`]);
  return { data: body, error: null };
};

export const deleteTransaction = async (id: ID) => {
  const { body, error } = await xooxFetch(`/transactions/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_TRANSACTION, `${RVK_TRANSACTION}_${id}`]);
  return { data: body, error: null };
};

export const getTransactionList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<TransactionItemType[]>
    >('/transactions', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_TRANSACTION] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getTransaction = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: TransactionItemType }>(
      `/transactions/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_TRANSACTION}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { data: null, error };
  }
};
