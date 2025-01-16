import { xooxFetch } from "@/lib/fetch";
import { QueryParams } from "@/lib/utils";
import { ID } from "@/lib/fetch/types";
import { RVK_ITEM, ItemItemType, ItemBodyType } from "./schema";
import {revalidate} from "@/lib/functions";


export const createItem = async (bodyData: ItemBodyType) => {
  const { body, error } = await xooxFetch<{data: ItemItemType}>("item", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  revalidate(RVK_ITEM);
  return { data: body, error };
};


export const patchItem = async ({id, ...bodyData}: ItemBodyType & {id: ID}) => {
  const { body, error } = await xooxFetch<{data: ItemItemType}>(`/item/${id}`, {
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  revalidate(RVK_ITEM);
  revalidate(`${RVK_ITEM}_${id}`);
  return { data: body, error };
};



export const deleteItem = async (id: ID) => {
  const { body, error } =  await xooxFetch(`/item/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });

  if(error) throw new Error(error);

  revalidate(RVK_ITEM);
  revalidate(`${RVK_ITEM}_${id}`);
  return { data: body, error: null };
};

export const getItems = async (searchParams: QueryParams = {}) => {
  try {
    const { body, error } = await xooxFetch<{data: ItemItemType[]}>("/item", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_ITEM]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching items:", error);
    return { data: { data: [] }, error };
  }
};

export const getItem = async (itemId: string) => {
  try {
    const { body, error } = await xooxFetch<{data: ItemItemType}>(`/item/${itemId}`, {
      method: "GET",
      next: {tags: [`${RVK_ITEM}_${itemId}`]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching item:", error);
    return { data: null, error };
  }
};