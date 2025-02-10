import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  CompanyCategoryBodyType,
  CompanyCategoryItemType,
  RVK_COMPANY_CATEGORY,
} from './schema';

export const createCompanyCategory = async (
  bodyData: CompanyCategoryBodyType,
) => {
  const { body, error } = await xooxFetch<{ data: CompanyCategoryItemType }>(
    'company-categories',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_COMPANY_CATEGORY]);
  return { data: body, error: null };
};

export const patchCompanyCategory = async ({
  id,
  ...bodyData
}: CompanyCategoryBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: CompanyCategoryItemType }>(
    `/company-categories/${id}`,
    {
      method: 'PATCH',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_COMPANY_CATEGORY, `${RVK_COMPANY_CATEGORY}_${id}`]);
  return { data: body, error: null };
};

export const deleteCompanyCategory = async (id: ID) => {
  const { body, error } = await xooxFetch(`/company-categories/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_COMPANY_CATEGORY, `${RVK_COMPANY_CATEGORY}_${id}`]);
  return { data: body, error: null };
};

export const getCompanyCategoryList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<CompanyCategoryItemType[]>
    >('/company-categories', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_COMPANY_CATEGORY] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching company-categories:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getCompanyCategory = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: CompanyCategoryItemType }>(
      `/company-categories/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_COMPANY_CATEGORY}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching company-categories:', error);
    return { data: null, error };
  }
};
