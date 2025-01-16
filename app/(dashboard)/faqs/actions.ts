import { xooxFetch } from "@/lib/fetch";
import { FaqBodyType, FaqItemType, RVK_FAQ } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { executeRevalidate } from "@/lib/xoox";

export const getFaqs = async (searchParams?: QueryParams) => {
  try {
    const { body } = await xooxFetch<PaginatedResType<FaqItemType[]>>("faq", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_FAQ]}
    });

    if (body?.data) return { data: body };
    return { data: { data: [], pagination: INITIAL_PAGINATION } };
  } catch (error) {
    
    console.error("Error fetching FAQ:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION } };
  }
};

export const createFAQ = async (bodyData: FaqBodyType) => {
  const { body, error } = await xooxFetch<{data: FaqItemType}>("faq", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_FAQ]);
  executeRevalidate([{tag: "faq"}]);
  return { data: body, error };
};

export const patchFaq = async ({ id, ...bodyData }: FaqBodyType & { id: ID; }) => {
  const { body, error } = await xooxFetch<{data: FaqItemType}>(`/faq/${id}`,{
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_FAQ]);
  executeRevalidate([{tag: "faq"}]);
  return { data: body, error };
};

export const deleteFaq = async (id: ID) => {
  const { body, error } =  await xooxFetch(`/faq/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_FAQ]);
  executeRevalidate([{tag: "faq"}]);
  return { data: body, error: null };
};