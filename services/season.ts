import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_SEASON } from './rvk';
import {
  BaseResponseDictType,
  BaseResponseUnionSeriesSeasonDictType,
  BaseResponseUnionSeriesSeasonDictType,
  SeriesSeasonCreateType,
  SeriesSeasonUpdateType,
} from './schema';

// Auto-generated service for season

export async function createSeriesSeason(body: SeriesSeasonCreateType) {
  const res = await actions.post<BaseResponseUnionSeriesSeasonDictType>(
    `/season`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function updateSeriesSeason(
  seasonId: string,
  body: SeriesSeasonUpdateType,
) {
  const res = await actions.put<BaseResponseUnionSeriesSeasonDictType>(
    `/season/${seasonId}`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_SEASON, `${RVK_SEASON}_season_id_${seasonId}`]);

  return response;
}

export async function deleteSeriesSeason(seasonId: string) {
  const res = await actions.destroy<BaseResponseDictType>(
    `/season/${seasonId}`,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_SEASON, `${RVK_SEASON}_season_id_${seasonId}`]);

  return response;
}
