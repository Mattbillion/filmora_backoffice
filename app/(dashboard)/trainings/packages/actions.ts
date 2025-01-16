import { goodaliFetch } from "@/lib/fetch";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { RVK_PACKAGE, PackageItemType, PackageBodyType } from "./schema";
import { executeRevalidate } from "@/lib/goodali";


export const createPackage = async (bodyData: PackageBodyType) => {
  const { body, error } = await goodaliFetch<{data: PackageItemType}>("package", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);
  
  executeRevalidate([RVK_PACKAGE]);
  executeRevalidate([{tag: "packages"}]);
  return { data: body, error };
};

export const patchPackage = async ({id, ...bodyData}: PackageBodyType & {id: ID}) => {
  const { body, error } = await goodaliFetch<{data: PackageItemType}>(`/package/${id}`, {
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_PACKAGE]);
  executeRevalidate([{tag: "packages"}, {path: `/courses/${bodyData.trainingId}/pricing`}]);
  return { data: body, error };
};

export const deletePackage = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/package/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_PACKAGE]);
  executeRevalidate([{tag: "packages"}, {path: `/courses`}]);
  return { data: body, error: null };
};

export const getPackages = async (searchParams: QueryParams = {}) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<PackageItemType[]>>("/package", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_PACKAGE]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching package:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};