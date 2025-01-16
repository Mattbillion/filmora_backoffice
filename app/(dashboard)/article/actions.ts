/* eslint-disable @typescript-eslint/no-explicit-any */
import { xooxFetch } from "@/lib/fetch";
import { RVK_ARTICLE, ArticleBodyType, ArticleItemType } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { executeRevalidate } from "@/lib/xoox";

export const createPost = async (bodyData: ArticleBodyType) => {
  const { body, error } = await xooxFetch<{data: ArticleItemType}>("article", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);

  executeRevalidate([RVK_ARTICLE]);
  executeRevalidate([{tag: "articles"}, {path: "/articles"}]);
  return { data: body, error: null };
};

export const patchPost = async ({ id, ...bodyData }: ArticleBodyType & { id: ID; }) => {
  const { body, error } =  await xooxFetch<{data: ArticleItemType}>(`/article/${id}`,{
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_ARTICLE]);
  executeRevalidate([{tag: "articles"}, {path: `/articles/${id}`}, {path: "/articles"}]);
  return { data: body, error: null };
};

export const deletePost = async (id: ID) => {
  const { body, error } =  await xooxFetch(`/article/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_ARTICLE]);
  executeRevalidate([{tag: "articles"}, {path: `/articles/${id}`}, {path: "/articles"}]);
  return { data: body, error: null };
};

export const getArticles = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<ArticleItemType[]>>("/article", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_ARTICLE]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
