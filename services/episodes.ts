import * as actions from './api/actions';
import { RVK_EPISODES } from './rvk';
import { BaseResponseUnionSeriesEpisodeDictType } from './schema';

// Auto-generated service for episodes

export async function getSeriesEpisodes(seasonNumber: string) {
  const res = await actions.get<any>(`/episodes/${seasonNumber}`, {
    next: {
      tags: [RVK_EPISODES, `${RVK_EPISODES}_season_number_${seasonNumber}`],
    },
  });

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function getSeriesEpisode(episodeId: string) {
  const res = await actions.get<BaseResponseUnionSeriesEpisodeDictType>(
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
