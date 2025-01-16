import { goodaliFetch } from "@/lib/fetch";
import { RVK_MOOD, MoodBodyType, MoodItemType } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import {revalidate} from "@/lib/functions";

export const createMood = async (bodyData: MoodBodyType) => {
  const { body, error } = await goodaliFetch<{data: MoodItemType}>("mood", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);

  revalidate(RVK_MOOD);
  return { data: body, error: null };
};

export const patchMood = async ({ id, ...bodyData }: MoodBodyType & { id: ID; }) => {
  const { body, error } =  await goodaliFetch<{data: MoodItemType}>(`/mood/${id}`,{
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  revalidate(RVK_MOOD);
  revalidate(`${RVK_MOOD}_${id}`);
  return { data: body, error: null };
};

export const deleteMood = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/mood/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });

  if(error) throw new Error(error);

  revalidate(RVK_MOOD);
  revalidate(`${RVK_MOOD}_${id}`);
  return { data: body, error: null };
};

export const getMoods = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<MoodItemType[]>>("/mood", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_MOOD]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching moods:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getMood = async (moodId: string) => {
  try {
    const { body, error } = await goodaliFetch<{data: MoodItemType}>(`/mood/${moodId}`, {
      method: "GET",
      next: {tags: [`${RVK_MOOD}_${moodId}`]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching moods:", error);
    return { data: null, error };
  }
};
