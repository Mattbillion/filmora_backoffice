import { goodaliFetch } from "@/lib/fetch";
import { RVK_MOOD_LIST, MoodListBodyType, MoodListItemType } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { executeRevalidate } from "@/lib/goodali";

export const createMoodList = async (bodyData: MoodListBodyType) => {
  const { body, error } = await goodaliFetch<{data: MoodListItemType}>("mood/list", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);

  executeRevalidate([RVK_MOOD_LIST]);
  executeRevalidate([{tag: "moods"}]);
  return { data: body, error: null };
};

export const patchMoodList = async ({ id, ...bodyData }: MoodListBodyType & { id: ID; }) => {
  const { body, error } =  await goodaliFetch<{data: MoodListItemType}>(`/mood/list/${id}`,{
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_MOOD_LIST, `${RVK_MOOD_LIST}_${id}`]);
  executeRevalidate([{tag: "moods"}]);

  return { data: body, error: null };
};

export const deleteMoodList = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/mood/list/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_MOOD_LIST, `${RVK_MOOD_LIST}_${id}`]);
  executeRevalidate([{tag: "moods"}]);
  return { data: body, error: null };
};

export const getMoodLists = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<MoodListItemType[]>>("/mood/list", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_MOOD_LIST]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching mood/lists:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getMoodListItem = async (moodListId: string) => {
  try {
    const { body, error } = await goodaliFetch<{data: MoodListItemType}>(`/mood/list/${moodListId}`, {
      method: "GET",
      next: {tags: [`${RVK_MOOD_LIST}_${moodListId}`]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching mood/lists:", error);
    return { data: null, error };
  }
};
