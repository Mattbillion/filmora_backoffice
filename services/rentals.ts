import * as actions from './api/actions';
import { BaseResponseUnionListMovieRentalDataNoneTypeType } from './schema';

// Auto-generated service for rentals

export type GetRentalCountsByUsersSearchParams = {
  limit?: number;
  offset?: number;
};

export async function getRentalCountsByUsers(
  searchParams?: GetRentalCountsByUsersSearchParams,
) {
  const res = await actions.get<any>(`/rentals/users`, {
    searchParams,
    cache: 'no-store',
  });

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export type GetMoviesRentalCountsSearchParams = {
  limit?: number;
  offset?: number;
};

export async function getMoviesRentalCounts(
  searchParams?: GetMoviesRentalCountsSearchParams,
) {
  const res =
    await actions.get<BaseResponseUnionListMovieRentalDataNoneTypeType>(
      `/rentals/movies`,
      {
        searchParams,
        cache: 'no-store',
      },
    );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}
