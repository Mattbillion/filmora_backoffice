import { filmoraFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/filmora';

import { MoviesBodyType, MoviesItemType, RVK_MOVIES } from './schema';

export const createMovies = async (bodyData: MoviesBodyType) => {
  const { body, error } = await filmoraFetch(`/movies`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_MOVIES]);
  return { data: body, error: null };
};

export const patchMoviesDetail = async ({
  id: param1,
  ...bodyData
}: MoviesBodyType & { id: ID }) => {
  const { body, error } = await filmoraFetch<{ data: MoviesItemType }>(
    `/movies/${param1}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_MOVIES, `${RVK_MOVIES}_${param1}`]);
  return { data: body, error: null };
};

export const deleteMoviesDetail = async (param1: string | ID) => {
  const { body, error } = await filmoraFetch(`/movies/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_MOVIES, `${RVK_MOVIES}_${param1}`]);
  return { data: body, error: null };
};

export const getMovies = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await filmoraFetch<PaginatedResType<MoviesItemType[]>>(
      '/movies',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_MOVIES] },
      },
    );

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /movies:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getMoviesDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await filmoraFetch<{ data: MoviesItemType }>(
      `/movies/${param1}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_MOVIES}_${param1}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /movies/${param1}:`, error);
    return { data: null, error };
  }
};
