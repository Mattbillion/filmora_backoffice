import { QueryParams } from '@interpriz/lib/utils';

import { filmoraFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';

import { executeRevalidate } from '../api/helpers';
import { MoviesBodyType, MoviesItemType, RVK_MOVIES } from './schema';

export async function getMovies(searchParams?: QueryParams) {
  try {
    const { body, error } = await filmoraFetch<
      PaginatedResType<MoviesBodyType>
    >('/movies', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_MOVIES] },
    });
    if (error) throw new Error(error);

    return { data: body, error: null };
  } catch (error) {
    console.error(`Error fetchin /movies:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
}

export async function deleteMoviesDetail(param1: string | ID) {
  const { body, error } = await filmoraFetch(`/movies/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);
  // console.log('deleteMoviesDetail', body);
  await executeRevalidate([RVK_MOVIES, `${RVK_MOVIES}_${param1}`]);
  return { data: body, error: null };
}

export async function getMoviesDetail(param1: string | ID) {
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
}

export async function updateMovie(
  param1: string | ID,
  payload: Record<string, unknown>,
) {
  const { body, error } = await filmoraFetch<{
    data: MoviesItemType;
    status: string;
    message: string;
  }>(`/movies/${param1}`, {
    method: 'PUT',
    body: payload,
  });
  if (error) throw new Error(error);
  return { data: body, error: null };
}
