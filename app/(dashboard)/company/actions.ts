import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
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

export const patchCompany = async ({
  id,
  ...bodyData
}: CompanyBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: CompanyItemType }>(
    `/companies/${id}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_COMPANY, `${RVK_COMPANY}_${id}`]);
  return { data: body, error: null };
};

export const deleteCompany = async (id: ID) => {
  const { body, error } = await xooxFetch(`/companies/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_COMPANY, `${RVK_COMPANY}_${id}`]);
  return { data: body, error: null };
};

export const getCompanies = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<CompanyItemType[]>
    >('/companies', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_COMPANY] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching companies:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getCompany = async (companyId: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: CompanyItemType }>(
      `/companies/${companyId}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_COMPANY}_${companyId}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching companies:', error);
    return { data: null, error };
  }
};
