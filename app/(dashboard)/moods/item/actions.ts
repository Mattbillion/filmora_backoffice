import { goodaliFetch } from "@/lib/fetch";
import { RVK_MOOD_ITEM, MoodItemBodyType, MoodItemItemType } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { executeRevalidate } from "@/lib/goodali";

export const createMoodItem = async (bodyData: MoodItemBodyType) => {
  const { body, error } = await goodaliFetch<{data: MoodItemItemType}>("mood/list/item", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);

  executeRevalidate([RVK_MOOD_ITEM]);
  executeRevalidate([{tag: "moods"}]);
  return { data: body, error: null };
};

export const patchMoodItem = async ({ id, ...bodyData }: MoodItemBodyType & { id: ID; }) => {
  const { body, error } =  await goodaliFetch<{data: MoodItemItemType}>(`/mood/list/item/${id}`,{
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_MOOD_ITEM, `${RVK_MOOD_ITEM}_${id}`]);
  executeRevalidate([{tag: "moods"}, {path: `/mood/${id}`}]);
  return { data: body, error: null };
};

export const deleteMoodItem = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/mood/list/item/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_MOOD_ITEM, `${RVK_MOOD_ITEM}_${id}`]);
  executeRevalidate([{tag: "moods"}, {path: `/mood/${id}`}]);
  return { data: body, error: null };
};

export const getMoodItems = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<MoodItemItemType[]>>("/mood/list/item", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_MOOD_ITEM]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching mood/lists:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
