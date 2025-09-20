import * as actions from '../api/actions';
import { BaseResponseUnionSeriesEpisodeDictType, RVK_EPISODES } from './schema';

// Auto-generated service for episodes

export async function getSeriesEpisodes(seasonNumber: string) {
  const res = await actions.get<any>(`/episodes/${seasonNumber}`, {
    next: {
      tags: [RVK_EPISODES, `${RVK_EPISODES}_seasonNumber_${seasonNumber}`],
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
        tags: [RVK_EPISODES, `${RVK_EPISODES}_episodeId_${episodeId}`],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}
