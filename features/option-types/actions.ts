import { filmoraFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/filmora';

import {
  OptionTypesBodyType,
  OptionTypesItemType,
  RVK_OPTIONTYPES,
} from './schema';

export const createOptionTypes = async (bodyData: OptionTypesBodyType) => {
  const { body, error } = await filmoraFetch<{ data: OptionTypesItemType }>(
    'option_types',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_OPTIONTYPES]);
  return { data: body, error: null };
};

export const patchOptionTypes = async ({
  id,
  ...bodyData
}: OptionTypesBodyType & { id: ID }) => {
  const { body, error } = await filmoraFetch<{ data: OptionTypesItemType }>(
    `/option_types/${id}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_OPTIONTYPES, `${RVK_OPTIONTYPES}_${id}`]);
  return { data: body, error: null };
};

export const deleteOptionTypes = async (id: ID) => {
  const { body, error } = await filmoraFetch(`/option_types/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_OPTIONTYPES, `${RVK_OPTIONTYPES}_${id}`]);
  return { data: body, error: null };
};

export const getOptionTypesList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await filmoraFetch<
      PaginatedResType<OptionTypesItemType[]>
    >('/option_types', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_OPTIONTYPES] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error('Error fetching optionTypes:', error);
    return { data: { data: [], total_count: 0 }, error };
  }
};
