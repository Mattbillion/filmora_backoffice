import { xooxFetch } from '@/lib/fetch';
import { PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';

import {
  MerchandiseDiscountSalesItemType,
  RVK_MERCHANDISE_DISCOUNT_SALES,
} from './schema';

export const getMerchandiseDiscountSales = async (
  searchParams?: QueryParams,
) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<MerchandiseDiscountSalesItemType[]>
    >('/merchandise-discount-sales', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_MERCHANDISE_DISCOUNT_SALES] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /merchandise-discount-sales:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};
