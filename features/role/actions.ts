import { filmoraFetch } from '@/lib/fetch';
import { PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/filmora';

import { RoleBodyType, RoleItemType, RVK_ROLE } from './schema';

export const createRole = async (bodyData: RoleBodyType) => {
  const { body, error } = await filmoraFetch<{ data: RoleItemType }>('roles', {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_ROLE]);
  return { data: body, error: null };
};

export const getRoleList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await filmoraFetch<PaginatedResType<RoleItemType[]>>(
      '/roles',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_ROLE] },
      },
    );

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error('Error fetching roles:', error);
    return { data: { data: [], total_count: 0 }, error };
  }
};
