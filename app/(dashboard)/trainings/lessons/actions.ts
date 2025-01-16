import { goodaliFetch } from "@/lib/fetch";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { RVK_LESSON, LessonItemType, LessonBodyType } from "./schema";
import {revalidate} from "@/lib/functions";


export const createLesson = async ({isPublic, ...bodyData}: LessonBodyType) => {
  const { body, error } = await goodaliFetch<{data: LessonItemType}>("lesson", {
    method: "POST",
    body: {...bodyData, isPublic: Number(isPublic)},
    cache: "no-store",
  });

  if(error) throw new Error(error);

  revalidate(RVK_LESSON);
  return { data: body, error };
};


export const patchLesson = async ({id, isPublic, ...bodyData}: LessonBodyType & {id: ID}) => {
  const { body, error } = await goodaliFetch<{data: LessonItemType}>(`/lesson/${id}`, {
    method: "PATCH",
    body: {...bodyData, isPublic: Number(isPublic)},
    cache: "no-store",
  });

  if(error) throw new Error(error);

  revalidate(RVK_LESSON);
  revalidate(`${RVK_LESSON}_${id}`);
  return { data: body, error };
};



export const deleteLesson = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/lesson/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });

  if(error) throw new Error(error);

  revalidate(RVK_LESSON);
  revalidate(`${RVK_LESSON}_${id}`);
  return { data: body, error: null };
};

export const getLessons = async (searchParams: QueryParams = {}) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<LessonItemType[]>>("/lesson", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_LESSON]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getLesson = async (lessonId: string) => {
  try {
    const { body, error } = await goodaliFetch<{data: LessonItemType}>(`/lesson/${lessonId}`, {
      method: "GET",
      next: {tags: [`${RVK_LESSON}_${lessonId}`]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return { data: null, error };
  }
};