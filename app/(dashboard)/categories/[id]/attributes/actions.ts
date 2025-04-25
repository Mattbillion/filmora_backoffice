import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  CategoryAttributesBodyType,
  CategoryAttributesItemType,
  RVK_CATEGORY_ATTRIBUTES,
} from './schema';

export const getCategoryAttributes = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<CategoryAttributesItemType[]>
    >('/category_attributes', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_CATEGORY_ATTRIBUTES] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /category_attributes:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getCategoryAttributesDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await xooxFetch<{
      data: CategoryAttributesItemType;
    }>(`/category_attributes/${param1}`, {
      method: 'GET',
      next: { tags: [`${RVK_CATEGORY_ATTRIBUTES}_${param1}`] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /category_attributes/${param1}:`, error);
    return { data: null, error };
  }
};

export const createCategoryAttributes = async (
  bodyData: CategoryAttributesBodyType,
) => {
  const { body, error } = await xooxFetch(`/category_attributes`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_CATEGORY_ATTRIBUTES]);
  return { data: body, error: null };
};

export const patchCategoryAttributesDetail = async ({
  id: param1,
  ...bodyData
}: CategoryAttributesBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: CategoryAttributesItemType }>(
    `/category_attributes/${param1}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_CATEGORY_ATTRIBUTES,
    `${RVK_CATEGORY_ATTRIBUTES}_${param1}`,
  ]);
  return { data: body, error: null };
};

export const deleteCategoryAttributesDetail = async (param1: string | ID) => {
  const { body, error } = await xooxFetch(`/category_attributes/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_CATEGORY_ATTRIBUTES,
    `${RVK_CATEGORY_ATTRIBUTES}_${param1}`,
  ]);
  return { data: body, error: null };
};
