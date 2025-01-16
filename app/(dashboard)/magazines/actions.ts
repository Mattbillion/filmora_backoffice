/* eslint-disable @typescript-eslint/no-explicit-any */
import { xooxFetch } from "@/lib/fetch";
import { RVK_MAGAZINE, MagazineBodyType, MagazineItemType } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { executeRevalidate } from "@/lib/xoox";

export const createMagazine = async (bodyData: MagazineBodyType) => {
  const { body, error } = await xooxFetch<{data: MagazineItemType}>("magazine", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);

  executeRevalidate([RVK_MAGAZINE]);
  executeRevalidate([{tag: "magazines"}, {path: "/magazine", type: "layout"}]);
  return { data: body, error: null };
};

export const patchMagazine = async ({ id, ...bodyData }: MagazineBodyType & { id: ID; }) => {
  const { body, error } =  await xooxFetch<{data: MagazineItemType}>(`/magazine/${id}`,{
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_MAGAZINE]);
  executeRevalidate([{tag: "magazines"}, {path: `/magazine/${id}`, type: "layout"}]);
  return { data: body, error: null };
};

export const deleteMagazine = async (id: ID) => {
  const { body, error } =  await xooxFetch(`/magazine/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_MAGAZINE]);
  executeRevalidate([{tag: "magazines"}, {path: `/magazine/${id}`, type: "layout"}]);
  return { data: body, error: null };
};

export const getMagazines = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<MagazineItemType[]>>("/magazine", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_MAGAZINE]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching magazines:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
