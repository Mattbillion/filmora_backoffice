import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { BranchBodyType, BranchItemType, RVK_BRANCH } from './schema';

export const createBranch = async (bodyData: BranchBodyType) => {
  const { body, error } = await xooxFetch<{ data: BranchItemType }>(
    'branches',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_BRANCH]);
  return { data: body, error: null };
};

export const patchBranch = async ({
  id,
  ...bodyData
}: BranchBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: BranchItemType }>(
    `/branches/${id}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_BRANCH, `${RVK_BRANCH}_${id}`]);
  return { data: body, error: null };
};

export const deleteBranch = async (id: ID) => {
  const { body, error } = await xooxFetch(`/branches/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_BRANCH, `${RVK_BRANCH}_${id}`]);
  return { data: body, error: null };
};

export const getBranchList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<BranchItemType[]>>(
      '/branches',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_BRANCH] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching branches:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getBranch = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: BranchItemType }>(
      `/branches/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_BRANCH}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching branches:', error);
    return { data: null, error };
  }
};
