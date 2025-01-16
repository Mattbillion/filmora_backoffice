import { goodaliFetch } from "@/lib/fetch";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { RVK_BANNER, BannerItemType, BannerBodyType, BannerProductType } from "./schema";
import { executeRevalidate } from "@/lib/goodali";


export const createBanner = async (bodyData: BannerBodyType) => {
  const { body, error } = await goodaliFetch<{data: BannerItemType}>("banners", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_BANNER]);
  executeRevalidate([{tag: "banners"}]);
  return { data: body, error };
};


export const patchBanner = async ({id, ...bodyData}: BannerBodyType & {id: ID}) => {
  const { body, error } = await goodaliFetch<{data: BannerItemType}>(`/banners/${id}`, {
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_BANNER]);
  executeRevalidate([{tag: "banners"}]);
  return { data: body, error };
};



export const deleteBanner = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/banners/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_BANNER]);
  executeRevalidate([{tag: "banners"}]);
  return { data: body, error: null };
};

export const getBanners = async (searchParams: QueryParams = {}) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<BannerItemType[]>>("/banners", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_BANNER]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching banners:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getBannerProducts = async (productType:string = "0") => {
  try {
    const { body } = await goodaliFetch<PaginatedResType<BannerProductType[]>>("/banners/product", {
      method: "GET",
      searchParams: {productType, limit: 1000},
      next: {tags: [RVK_BANNER]}
    });

    if (body?.data) {
      return { data: body };
    } else {
      return { data: { data: [], pagination: INITIAL_PAGINATION } };
    }
  } catch (error) {
    console.error("Error fetching banner products:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
