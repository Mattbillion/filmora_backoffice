import * as actions from './api/actions';
import { RVK_RENTALS } from './rvk';
import { BaseResponseUnionListMovieRentalDataNoneTypeType } from './schema';

// Auto-generated service for rentals

export async function getRentalCountsByUsers(
  searchParams: {
    limit?: number;
    offset?: number;
  } = {},
) {
  const res = await actions.get<any>(`/rentals/users`, {
    searchParams,
    next: {
      tags: [RVK_RENTALS],
    },
  });

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function getMoviesRentalCounts(
  searchParams: {
    limit?: number;
    offset?: number;
  } = {},
) {
  const res =
    await actions.get<BaseResponseUnionListMovieRentalDataNoneTypeType>(
      `/rentals/movies`,
      {
        searchParams,
        next: {
          tags: [RVK_RENTALS],
        },
      },
    );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}
