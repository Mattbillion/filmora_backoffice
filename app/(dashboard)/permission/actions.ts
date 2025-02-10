import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  PermissionBodyType,
  PermissionItemType,
  RVK_PERMISSION,
} from './schema';

export const createPermission = async (bodyData: PermissionBodyType) => {
  const { body, error } = await xooxFetch<{ data: PermissionItemType }>(
    'permissions',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_PERMISSION]);
  return { data: body, error: null };
};

export const patchPermission = async ({
  id,
  ...bodyData
}: PermissionBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: PermissionItemType }>(
    `/permissions/${id}`,
    {
      method: 'PATCH',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_PERMISSION, `${RVK_PERMISSION}_${id}`]);
  return { data: body, error: null };
};

export const deletePermission = async (id: ID) => {
  const { body, error } = await xooxFetch(`/permissions/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_PERMISSION, `${RVK_PERMISSION}_${id}`]);
  return { data: body, error: null };
};

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

export const getPermission = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: PermissionItemType }>(
      `/permissions/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_PERMISSION}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return { data: null, error };
  }
};
