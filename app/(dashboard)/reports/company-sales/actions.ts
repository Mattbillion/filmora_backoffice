import { xooxFetch } from '@/lib/fetch';
import { PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';

import { CompanySalesItemType, RVK_COMPANY_SALES } from './schema';

export const getCompanySales = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<CompanySalesItemType[]>
    >('/company-sales', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_COMPANY_SALES] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /company-sales:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};
