/* eslint-disable @typescript-eslint/no-explicit-any */
import { goodaliFetch } from "@/lib/fetch";
import { RVK_MAGAZINE_ARTICLE, ArticleBodyType, ArticleItemType } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { executeRevalidate } from "@/lib/goodali";

export const createPost = async (bodyData: ArticleBodyType) => {
  const { body, error } = await goodaliFetch<{data: ArticleItemType}>("/magazine/article", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);

  executeRevalidate([RVK_MAGAZINE_ARTICLE]);
  executeRevalidate([{tag: "magazine_articles"}]);
  return { data: body, error: null };
};

export const patchPost = async ({ id, ...bodyData }: ArticleBodyType & { id: ID; }) => {
  const { body, error } =  await goodaliFetch<{data: ArticleItemType}>(`/magazine/article/${id}`,{
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_MAGAZINE_ARTICLE]);
  executeRevalidate([{tag: "magazine_articles"}, {path: `/magazine/${body.data.magazine_id}/${id}`}]);
  return { data: body, error: null };
};

export const deletePost = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/magazine/article/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_MAGAZINE_ARTICLE]);
  executeRevalidate([{tag: "magazine_articles"}, {path: `/magazine`, type: 'layout'}]);
  return { data: body, error: null };
};

export const getArticles = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<ArticleItemType[]>>("/magazine/article", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_MAGAZINE_ARTICLE]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
