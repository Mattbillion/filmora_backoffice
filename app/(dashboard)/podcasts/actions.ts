import { goodaliFetch } from "@/lib/fetch";
import { RVK_PODCAST, PodcastBodyType, PodcastItemType } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { executeRevalidate } from "@/lib/goodali";

export const createPodcast = async (bodyData: PodcastBodyType) => {
  const { body, error } = await goodaliFetch<{data: PodcastItemType}>("podcast", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);

  executeRevalidate([RVK_PODCAST]);
  executeRevalidate([{tag: "podcasts"}]);
  return { data: body, error: null };
};

export const patchPodcast = async ({ id, ...bodyData }: PodcastBodyType & { id: ID; }) => {
  const { body, error } =  await goodaliFetch<{data: PodcastItemType}>(`/podcast/${id}`,{
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_PODCAST]);
  executeRevalidate([{tag: "podcasts"}]);
  return { data: body, error: null };
};

export const deletePodcast = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/podcast/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_PODCAST]);
  executeRevalidate([{tag: "podcasts"}]);
  return { data: body, error: null };
};

export const getPodcasts = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<PodcastItemType[]>>("/podcast", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_PODCAST]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
