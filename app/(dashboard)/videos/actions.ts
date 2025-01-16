import { goodaliFetch } from "@/lib/fetch";
import { RVK_VIDEO, VideoBodyType, VideoItemType } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { executeRevalidate } from "@/lib/goodali";

export const createVideo = async (bodyData: VideoBodyType) => {
  const { body, error } = await goodaliFetch<{data: VideoItemType}>("video", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);

  executeRevalidate([RVK_VIDEO]);
  executeRevalidate([{tag: "videos"}]);
  return { data: body, error: null };
};

export const patchVideo = async ({ id, ...bodyData }: VideoBodyType & { id: ID; }) => {
  const { body, error } =  await goodaliFetch<{data: VideoItemType}>(`/video/${id}`,{
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_VIDEO]);
  executeRevalidate([{tag: "videos"}, {path: `/videos/${id}`}]);
  return { data: body, error: null };
};

export const deleteVideo = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/video/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_VIDEO]);
  executeRevalidate([{tag: "videos"}, {path: `/videos/${id}`}]);
  return { data: body, error: null };
};

export const getVideos = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<VideoItemType[]>>("/video", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_VIDEO]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
