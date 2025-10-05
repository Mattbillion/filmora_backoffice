import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_GENRES } from './rvk';
import {
  BaseResponseUnionDictNoneTypeType,
  BaseResponseUnionGenreResponseNoneTypeType,
  BaseResponseUnionListGenreResponseNoneTypeType,
  GenreCreateType,
  GenreUpdateType,
} from './schema';

// Auto-generated service for genres

export type GetGenresSearchParams = {
  page?: number;
  page_size?: number;
};

export async function getGenres(searchParams?: GetGenresSearchParams) {
  const res = await actions.get<BaseResponseUnionListGenreResponseNoneTypeType>(
    `/genres`,
    {
      searchParams,
      next: {
        tags: [RVK_GENRES],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function createGenre(body: GenreCreateType) {
  const res = await actions.post<BaseResponseUnionGenreResponseNoneTypeType>(
    `/genres`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function getGenre(genreId: number) {
  const res = await actions.get<BaseResponseUnionGenreResponseNoneTypeType>(
    `/genres/${genreId}`,
    {
      next: {
        tags: [RVK_GENRES, `${RVK_GENRES}_genre_id_${genreId}`],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function updateGenre(genreId: number, body: GenreUpdateType) {
  const res = await actions.put<BaseResponseUnionGenreResponseNoneTypeType>(
    `/genres/${genreId}`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_GENRES, `${RVK_GENRES}_genre_id_${genreId}`]);

  return response;
}

export async function deleteGenre(genreId: number) {
  const res = await actions.destroy<BaseResponseUnionDictNoneTypeType>(
    `/genres/${genreId}`,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_GENRES, `${RVK_GENRES}_genre_id_${genreId}`]);

  return response;
}
