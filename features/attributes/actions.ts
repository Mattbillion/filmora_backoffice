import { filmoraFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/filmora';

import {
  CategoryAttributesBodyType,
  CategoryAttributesItemType,
  CategoryAttributesValueItemType,
  RVK_CATEGORY_ATTRIBUTE_VALUES,
  RVK_CATEGORY_ATTRIBUTES,
} from './schema';

export const getAttributesHash = async (searchParams?: QueryParams) => {
  try {
    const { data } = await getAttributes(searchParams, [
      `${RVK_CATEGORY_ATTRIBUTES}_${Buffer.from(JSON.stringify(searchParams || {})).toString('base64')}`,
    ]);

    return {
      data: (data.data || []).reduce(
        (acc, curr) => ({ ...acc, [curr.id]: curr.attr_name }),
        {},
      ),
    };
  } catch (error) {
    console.error(`Error fetching category_attributes_hash:`, error);
    return { data: {}, error };
  }
};

export const getAttributes = async (
  searchParams: QueryParams = {},
  cacheKeys?: string[],
) => {
  try {
    const { body, error } = await filmoraFetch<
      PaginatedResType<CategoryAttributesItemType[]>
    >('/category_attributes', {
      method: 'GET',
      searchParams,
      next: {
        tags: [RVK_CATEGORY_ATTRIBUTES, ...(cacheKeys || [])],
      },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /category_attributes:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const createAttribute = async (bodyData: CategoryAttributesBodyType) => {
  const { body, error } = await filmoraFetch(`/category_attributes`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_CATEGORY_ATTRIBUTES]);
  return { data: body, error: null };
};

export const patchAttribute = async ({
  id: param1,
  ...bodyData
}: CategoryAttributesBodyType & { id: ID }) => {
  const { body, error } = await filmoraFetch<{ data: CategoryAttributesItemType }>(
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

export const deleteAttribute = async (param1: string | ID) => {
  const { body, error } = await filmoraFetch(`/category_attributes/${param1}`, {
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

export const getAttributeValuesHash = async (searchParams?: QueryParams) => {
  try {
    const { data } = await getAttributeValues(searchParams, [
      `${RVK_CATEGORY_ATTRIBUTE_VALUES}_${Buffer.from(JSON.stringify(searchParams || {})).toString('base64')}`,
    ]);

    return {
      data: (data.data || []).reduce(
        (acc, curr) => ({ ...acc, [curr.id]: curr.value }),
        {},
      ),
    };
  } catch (error) {
    console.error(`Error fetching category_attribute_values_hash:`, error);
    return { data: {}, error };
  }
};

export const getAttributeValues = async (
  searchParams: QueryParams = {},
  cacheKeys?: string[],
) => {
  try {
    const { body, error } = await filmoraFetch<
      PaginatedResType<CategoryAttributesValueItemType[]>
    >('/attribute_values', {
      method: 'GET',
      searchParams,
      next: {
        tags: [RVK_CATEGORY_ATTRIBUTE_VALUES, ...(cacheKeys || [])],
      },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /attribute_values:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const deleteAttributeValue = async (param1: string | ID) => {
  const { body, error } = await filmoraFetch(`/attribute_values/${param1}`, {
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

export const patchAttributeValue = async ({
  id: param1,
  ...bodyData
}: {
  id: ID;
  value: string;
}) => {
  const { body, error } = await filmoraFetch<{
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

export const createAttributeValue = async (bodyData: {
  attr_id: ID;
  display_order: number;
  status: boolean;
  value: string;
}) => {
  const { body, error } = await filmoraFetch(`/attribute_values`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_CATEGORY_ATTRIBUTE_VALUES]);
  return { data: body, error: null };
};
