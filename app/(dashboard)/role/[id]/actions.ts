import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { RoleBodyType, RoleItemType, RVK_ROLE } from './schema';

export const createRole = async (bodyData: RoleBodyType) => {
  const { body, error } = await xooxFetch<{ data: RoleItemType }>('roles', {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_ROLE]);
  return { data: body, error: null };
};

export const patchRole = async ({
  id,
  ...bodyData
}: RoleBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: RoleItemType }>(
    `/roles/${id}`,
    {
      method: 'PATCH',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_ROLE, `${RVK_ROLE}_${id}`]);
  return { data: body, error: null };
};

export const deleteRole = async (id: ID) => {
  const { body, error } = await xooxFetch(`/roles/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_ROLE, `${RVK_ROLE}_${id}`]);
  return { data: body, error: null };
};

export const getRoleList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<RoleItemType[]>>(
      '/roles',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_ROLE] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching roles:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getRolePermissionList = async (
  id: ID,
  searchParams?: QueryParams,
) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<RoleItemType[]>>(
      `/role_permissions/${id}`,
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_ROLE] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching roles:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
