import { filmoraFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { executeRevalidate } from '@/lib/filmora';
import { QueryParams } from '@/lib/utils';

import { GenresBodyType, GenresItemType, RVK_GENRES } from './schema';

export const getGenres = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await filmoraFetch<
      PaginatedResType<GenresItemType[]>
    >('/genres', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_GENRES] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /genres:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getGenresDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await filmoraFetch<{ data: GenresItemType }>(
      `/genres/${param1}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_GENRES}_${param1}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /genres/${param1}:`, error);
    return { data: null, error };
  }
};

export const createGenres = async (bodyData: GenresBodyType) => {
  const { body, error } = await filmoraFetch(`/genres`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_GENRES]);
  return { data: body, error: null };
};

export const patchGenresDetail = async ({
  id: param1,
  ...bodyData
}: GenresBodyType & { id: ID }) => {
  const { body, error } = await filmoraFetch<{ data: GenresItemType }>(
    `/genres/${param1}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_GENRES, `${RVK_GENRES}_${param1}`]);
  return { data: body, error: null };
};

export const deleteGenresDetail = async (param1: string | ID) => {
  const { body, error } = await filmoraFetch(`/genres/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_GENRES, `${RVK_GENRES}_${param1}`]);
  return { data: body, error: null };
};
