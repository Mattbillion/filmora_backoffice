import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  CategoryAttributesBodyType,
  CategoryAttributesItemType,
  CategoryAttributesValueItemType,
  RVK_CATEGORY_ATTRIBUTE_VALUES,
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

export const getCategoryAttributeValues = async (
  searchParams?: QueryParams,
) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<CategoryAttributesValueItemType[]>
    >('/attribute_values', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_CATEGORY_ATTRIBUTE_VALUES] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /attribute_values:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const deleteCategoryAttributeValue = async (param1: string | ID) => {
  const { body, error } = await xooxFetch(`/attribute_values/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_CATEGORY_ATTRIBUTE_VALUES,
    `${RVK_CATEGORY_ATTRIBUTE_VALUES}_${param1}`,
  ]);
  return { data: body, error: null };
};

export const patchCategoryAttributeValue = async ({
  id: param1,
  ...bodyData
}: {
  id: ID;
  value: string;
}) => {
  const { body, error } = await xooxFetch<{
    data: CategoryAttributesValueItemType;
  }>(`/attribute_values/${param1}`, {
    method: 'PUT',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_CATEGORY_ATTRIBUTE_VALUES,
    `${RVK_CATEGORY_ATTRIBUTE_VALUES}_${param1}`,
  ]);
  return { data: body, error: null };
};

export const createCategoryAttributeValue = async (bodyData: {
  attr_id: ID;
  display_order: number;
  status: boolean;
  value: string;
}) => {
  const { body, error } = await xooxFetch(`/attribute_values`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_CATEGORY_ATTRIBUTE_VALUES]);
  return { data: body, error: null };
};
