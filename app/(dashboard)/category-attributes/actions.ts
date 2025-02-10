import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  CategoryAttributesBodyType,
  CategoryAttributesItemType,
  RVK_CATEGORY_ATTRIBUTES,
} from './schema';

export const createCategoryAttributes = async (
  bodyData: CategoryAttributesBodyType,
) => {
  const { body, error } = await xooxFetch<{ data: CategoryAttributesItemType }>(
    'category-attributes',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_CATEGORY_ATTRIBUTES]);
  return { data: body, error: null };
};

export const patchCategoryAttributes = async ({
  id,
  ...bodyData
}: CategoryAttributesBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: CategoryAttributesItemType }>(
    `/category-attributes/${id}`,
    {
      method: 'PATCH',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_CATEGORY_ATTRIBUTES,
    `${RVK_CATEGORY_ATTRIBUTES}_${id}`,
  ]);
  return { data: body, error: null };
};

export const deleteCategoryAttributes = async (id: ID) => {
  const { body, error } = await xooxFetch(`/category-attributes/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_CATEGORY_ATTRIBUTES,
    `${RVK_CATEGORY_ATTRIBUTES}_${id}`,
  ]);
  return { data: body, error: null };
};

export const getCategoryAttributesList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<CategoryAttributesItemType[]>
    >('/category-attributes', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_CATEGORY_ATTRIBUTES] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching category-attributes:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getCategoryAttributes = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{
      data: CategoryAttributesItemType;
    }>(`/category-attributes/${id}`, {
      method: 'GET',
      next: { tags: [`${RVK_CATEGORY_ATTRIBUTES}_${id}`] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching category-attributes:', error);
    return { data: null, error };
  }
};
