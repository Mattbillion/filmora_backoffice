import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_EPISODES } from './rvk';
import {
  BaseResponseDictType,
  BaseResponseListSeriesEpisodeType,
  BaseResponseUnionSeriesEpisodeNoneTypeType,
} from './schema';

// Auto-generated service for episodes

export async function getSeriesEpisodes(seasonId: string) {
  const res = await actions.get<BaseResponseListSeriesEpisodeType>(
    `/episodes/${seasonId}`,
    {
      next: {
        tags: [RVK_EPISODES, `${RVK_EPISODES}_season_number_${seasonId}`],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function getSeriesEpisode(episodeId: string) {
  const res = await actions.get<BaseResponseUnionSeriesEpisodeNoneTypeType>(
    `/episodes/${episodeId}/details`,
    {
      next: {
        tags: [RVK_EPISODES, `${RVK_EPISODES}_episode_id_${episodeId}`],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function updateEpisode(episodeId: string, body: any) {
  const res = await actions.patch<BaseResponseUnionSeriesEpisodeNoneTypeType>(
    `/episodes/${episodeId}`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_EPISODES, `${RVK_EPISODES}_episode_id_${episodeId}`]);

  return response;
}

export async function deleteEpisode(episodeId: string) {
  const res = await actions.destroy<BaseResponseDictType>(
    `/episodes/${episodeId}`,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_EPISODES, `${RVK_EPISODES}_episode_id_${episodeId}`]);

  return response;
}
