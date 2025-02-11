import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { CategoryBodyType, CategoryItemType, RVK_CATEGORY } from './schema';

export const createCategory = async (bodyData: CategoryBodyType) => {
  const { body, error } = await xooxFetch<{ data: CategoryItemType }>(
    'category',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_CATEGORY]);
  return { data: body, error: null };
};

export const patchCategory = async ({
  id,
  ...bodyData
}: CategoryBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: CategoryItemType }>(
    `/category/${id}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_CATEGORY, `${RVK_CATEGORY}_${id}`]);
  return { data: body, error: null };
};

export const deleteCategory = async (id: ID) => {
  const { body, error } = await xooxFetch(`/category/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  console.log(body, 'body');

  if (error) throw new Error(error);

  executeRevalidate([RVK_CATEGORY, `${RVK_CATEGORY}_${id}`]);
  return { data: body, error: null };
};

export const getCategoryList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<CategoryItemType[]>
    >('/category', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_CATEGORY] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getCategory = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: CategoryItemType }>(
      `/category/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_CATEGORY}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { data: null, error };
  }
};
