import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { BranchesBodyType, BranchesItemType, RVK_BRANCHES } from './schema';

export const getBranches = async (
  searchParams: QueryParams = {},
  cacheKeys: string[] = [],
) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<BranchesItemType[]>
    >('/branches', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_BRANCHES, ...cacheKeys] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /branches:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getBranchesHash = async (searchParams?: QueryParams) => {
  try {
    const { data } = await getBranches(searchParams, [
      `${RVK_BRANCHES}_${Buffer.from(JSON.stringify(searchParams || {})).toString('base64')}`,
    ]);

    return {
      data: (data.data || []).reduce(
        (acc, cur) => ({ ...acc, [cur.id]: cur.branch_name }),
        {},
      ) as Record<ID, string>,
    };
  } catch (error) {
    console.error(`Error fetching getCategoriesHash`, error);
    return { data: {} as Record<ID, string>, error };
  }
};

export const getBranchesDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await xooxFetch<{ data: BranchesItemType }>(
      `/branches/${param1}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_BRANCHES}_${param1}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /branches/${param1}:`, error);
    return { data: null, error };
  }
};

export const createBranches = async (bodyData: BranchesBodyType) => {
  const { body, error } = await xooxFetch(`/branches`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_BRANCHES]);
  return { data: body, error: null };
};

export const patchBranchesDetail = async ({
  id: param1,
  ...bodyData
}: BranchesBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: BranchesItemType }>(
    `/branches/${param1}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_BRANCHES, `${RVK_BRANCHES}_${param1}`]);
  return { data: body, error: null };
};

export const deleteBranchesDetail = async (param1: string | ID) => {
  const { body, error } = await xooxFetch(`/branches/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_BRANCHES, `${RVK_BRANCHES}_${param1}`]);
  return { data: body, error: null };
};
