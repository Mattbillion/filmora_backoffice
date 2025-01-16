import { goodaliFetch } from "@/lib/fetch";
import { MagazineCategoryBodyType, MagazineCategoryItemType, RVK_MAGAZINE_CATEGORY } from "./schema";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { executeRevalidate } from "@/lib/goodali";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";

export const createMagazineCategory = async (bodyData: MagazineCategoryBodyType) => {
  const { body, error } = await goodaliFetch<{data: MagazineCategoryItemType}>("/magazine/category", { method: "POST", body: bodyData, cache: "no-store" });

  if(error) throw new Error(error);

  executeRevalidate([RVK_MAGAZINE_CATEGORY]);
  executeRevalidate([{tag: "magazine_categories"}]);
  return { data: body, error };
};

export const patchMagazineCategory = async ({id, ...bodyData}: MagazineCategoryBodyType & {id: ID}) => {
  const { body, error } = await goodaliFetch<{data: MagazineCategoryItemType}>(
    `/magazine/category/${id}`,
    {
      method: "PATCH",
      body: bodyData,
      cache: "no-store",
    }
  );
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_MAGAZINE_CATEGORY]);
  executeRevalidate([{tag: "magazine_categories"}]);
  return { data: body, error };
};

export const deleteMagazineCategory = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/magazine/category/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_MAGAZINE_CATEGORY]);
  executeRevalidate([{tag: "magazine_categories"}]);
  return { data: body, error: null };
};

export const getMagazineCategories = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<MagazineCategoryItemType[]>>(
      "/magazine/category",
      {
        method: "GET",
        searchParams,
        next: {tags: [RVK_MAGAZINE_CATEGORY]},
      }
    );

    if(error) throw new Error(error);

    return { data: body, error };
  } catch (error) {
    console.error("Error fetching magazine categories:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};