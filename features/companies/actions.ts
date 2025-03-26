'use server';

import { xooxFetch } from '@/lib/fetch';
import { PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { CompanyBodyType, CompanyItemType, RVK_COMPANY } from './schema';

export const createCompany = async (bodyData: CompanyBodyType) => {
  const { body, error } = await xooxFetch<{ data: CompanyItemType }>(
    'companies',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_COMPANY]);
  return { data: body, error: null };
};

export const getCompanyList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<CompanyItemType[]>
    >('/companies', {
      method: 'GET',
      searchParams,
      cache: 'no-store',
      next: { tags: [RVK_COMPANY] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching companies:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getCompany = async (id: string) => {
  try {
    if (!id) throw new Error(`Company with id ${id} not found`);
    const { body, error } = await xooxFetch<{ data: CompanyItemType }>(
      `/companies/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_COMPANY}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching companies:', error);
    return { data: null, error };
  }
};
