import { goodaliFetch } from "@/lib/fetch";
import { RVK_LECTURE, LectureBodyType, LectureItemType } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { executeRevalidate } from "@/lib/goodali";

export const createLecture = async (bodyData: LectureBodyType) => {
  const { body, error } = await goodaliFetch<{data: LectureItemType}>("lecture", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);

  executeRevalidate([RVK_LECTURE])
  executeRevalidate([{tag: "albums"}, {path: `/albums/${bodyData.albumId}`}])
  return { data: body, error: null };
};

export const patchLecture = async ({ id, ...bodyData }: LectureBodyType & { id: ID; }) => {
  const { body, error } =  await goodaliFetch<{data: LectureItemType}>(`/lecture/${id}`,{
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);


  executeRevalidate([RVK_LECTURE])
  executeRevalidate([{tag: "albums"}, {path: `/albums/${bodyData.albumId}`}, {path: `/albums/${bodyData.albumId}/${id}`}])

  return { data: body, error: null };
};

export const deleteLecture = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/lecture/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  

  executeRevalidate([RVK_LECTURE])
  executeRevalidate([{tag: "albums"}, {path: `/albums`}])

  return { data: body, error: null };
};

export const getLectures = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<LectureItemType[]>>("/lecture", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_LECTURE]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching lectures:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
