import { xooxFetch } from "@/lib/fetch";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { RVK_TRAINING, TrainingItemType, TrainingBodyType } from "./schema";
import { executeRevalidate } from "@/lib/xoox";


export const createTraining = async (bodyData: TrainingBodyType) => {
  const { body, error } = await xooxFetch<{data: TrainingItemType}>("training", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_TRAINING]);
  executeRevalidate([{tag: "courses"}]);
  return { data: body, error };
};


export const patchTraining = async ({id, ...bodyData}: TrainingBodyType & {id: ID}) => {
  const { body, error } = await xooxFetch<{data: TrainingItemType}>(`/training/${id}`, {
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);

  executeRevalidate([RVK_TRAINING, `${RVK_TRAINING}_${id}`]);
  executeRevalidate([{tag: "courses"}, {path: `/courses/${id}`}]);
  return { data: body, error };
};



export const deleteTraining = async (id: ID) => {
  const { body, error } =  await xooxFetch(`/training/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_TRAINING, `${RVK_TRAINING}_${id}`]);
  executeRevalidate([{tag: "courses"}, {path: `/courses/${id}`}]);
  return { data: body, error: null };
};

export const getTrainings = async (searchParams: QueryParams = {}) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<TrainingItemType[]>>("/training", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_TRAINING]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching training:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
export const getTraining = async (trainingId: string) => {
  try {
    const { body, error } = await xooxFetch<{data: TrainingItemType}>(`/training/${trainingId}`, {
      method: "GET",
      next: {tags: [`${RVK_TRAINING}_${trainingId}`]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching training:", error);
    return { data: null, error };
  }
};