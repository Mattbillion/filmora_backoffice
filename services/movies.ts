import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_MOVIES } from './rvk';
import {
  BaseResponseUnionDictNoneTypeType,
  BaseResponseUnionListMovieListResponseNoneTypeType,
  BaseResponseUnionMovieResponseNoneTypeType,
  BaseResponseUnionMovieResponseNoneTypeType,
  MovieCreateType,
  MovieUpdateType,
  SingleItemReponseMovieResponseType,
} from './schema';

// Auto-generated service for movies

export async function createMovie(body: MovieCreateType) {
  const res = await actions.post<BaseResponseUnionMovieResponseNoneTypeType>(
    `/movies`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function getMovies(
  searchParams: {
    page?: number;
    page_size?: number;
    title?: string;
    type?: string;
    year?: number;
    category_id?: number;
    genre_id?: number;
    is_premium?: boolean;
    is_adult?: boolean;
  } = {},
) {
  const res =
    await actions.get<BaseResponseUnionListMovieListResponseNoneTypeType>(
      `/movies`,
      {
        searchParams,
        next: {
          tags: [RVK_MOVIES],
        },
      },
    );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function getMovie(movieId: string) {
  const res = await actions.get<SingleItemReponseMovieResponseType>(
    `/movies/${movieId}`,
    {
      next: {
        tags: [RVK_MOVIES, `${RVK_MOVIES}_movie_id_${movieId}`],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function updateMovie(movieId: string, body: MovieUpdateType) {
  const res = await actions.put<BaseResponseUnionMovieResponseNoneTypeType>(
    `/movies/${movieId}`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_MOVIES, `${RVK_MOVIES}_movie_id_${movieId}`]);

  return response;
}

export async function deleteMovie(movieId: string) {
  const res = await actions.destroy<BaseResponseUnionDictNoneTypeType>(
    `/movies/${movieId}`,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_MOVIES, `${RVK_MOVIES}_movie_id_${movieId}`]);

  return response;
}
