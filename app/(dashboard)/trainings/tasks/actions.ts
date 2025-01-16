import { goodaliFetch } from "@/lib/fetch";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { RVK_TASK, TaskItemType, TaskBodyType } from "./schema";
import {revalidate} from "@/lib/functions";


export const createTask = async (bodyData: TaskBodyType) => {
  const { body, error } = await goodaliFetch<{data: TaskItemType}>("task", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  revalidate(RVK_TASK);
  return { data: body, error };
};


export const patchTask = async ({id, ...bodyData}: TaskBodyType & {id: ID}) => {
  const { body, error } = await goodaliFetch<{data: TaskItemType}>(`/task/${id}`, {
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  revalidate(RVK_TASK);
  return { data: body, error };
};



export const deleteTask = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/task/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });

  if(error) throw new Error(error);

  revalidate(RVK_TASK);
  return { data: body, error: null };
};

export const getTasks = async (searchParams: QueryParams = {}) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<TaskItemType[]>>("/task", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_TASK]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};