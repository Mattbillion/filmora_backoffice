import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  MerchandiseAttributeValuesBodyType,
  MerchandiseAttributeValuesItemType,
  RVK_MERCHANDISE_ATTRIBUTE_VALUES,
} from './schema';

export const createMerchandiseAttributeValues = async (
  bodyData: MerchandiseAttributeValuesBodyType,
) => {
  const { body, error } = await xooxFetch<{
    data: MerchandiseAttributeValuesItemType;
  }>('merchandise-attribute-values', {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_MERCHANDISE_ATTRIBUTE_VALUES]);
  return { data: body, error: null };
};

export const patchMerchandiseAttributeValues = async ({
  id,
  ...bodyData
}: MerchandiseAttributeValuesBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{
    data: MerchandiseAttributeValuesItemType;
  }>(`/merchandise-attribute-values/${id}`, {
    method: 'PATCH',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_MERCHANDISE_ATTRIBUTE_VALUES,
    `${RVK_MERCHANDISE_ATTRIBUTE_VALUES}_${id}`,
  ]);
  return { data: body, error: null };
};

export const deleteMerchandiseAttributeValues = async (id: ID) => {
  const { body, error } = await xooxFetch(
    `/merchandise-attribute-values/${id}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_MERCHANDISE_ATTRIBUTE_VALUES,
    `${RVK_MERCHANDISE_ATTRIBUTE_VALUES}_${id}`,
  ]);
  return { data: body, error: null };
};

export const getMerchandiseAttributeValuesList = async (
  searchParams?: QueryParams,
) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<MerchandiseAttributeValuesItemType[]>
    >('/merchandise-attribute-values', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_MERCHANDISE_ATTRIBUTE_VALUES] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching merchandise-attribute-values:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getMerchandiseAttributeValues = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{
      data: MerchandiseAttributeValuesItemType;
    }>(`/merchandise-attribute-values/${id}`, {
      method: 'GET',
      next: { tags: [`${RVK_MERCHANDISE_ATTRIBUTE_VALUES}_${id}`] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching merchandise-attribute-values:', error);
    return { data: null, error };
  }
};
