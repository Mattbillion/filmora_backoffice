import { xooxFetch } from '@/lib/fetch';
import { PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';

import { PermissionItemType, RVK_PERMISSION } from './schema';

export const getPermissionList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<PermissionItemType[]>
    >('/permissions', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_PERMISSION] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
