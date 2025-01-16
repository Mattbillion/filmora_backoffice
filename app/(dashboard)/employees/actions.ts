import { goodaliFetch } from "@/lib/fetch";
import { RVK_EMPLOYEE, EmployeeBodyType, EmployeeItemType } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import {revalidate} from "@/lib/functions";

export const createEmployee = async (bodyData: EmployeeBodyType) => {
  const { body, error } = await goodaliFetch<{data: EmployeeItemType}>("employee", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);

  revalidate(RVK_EMPLOYEE);
  return { data: body, error: null };
};

export const patchEmployee = async ({ id, ...bodyData }: EmployeeBodyType & { id: ID; }) => {
  const { body, error } =  await goodaliFetch<{data: EmployeeItemType}>(`/employee/${id}`,{
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);

  revalidate(RVK_EMPLOYEE);
  revalidate(`${RVK_EMPLOYEE}_${id}`);
  return { data: body, error: null };
};

export const deleteEmployee = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/employee/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });

  if(error) throw new Error(error);

  revalidate(RVK_EMPLOYEE);
  revalidate(`${RVK_EMPLOYEE}_${id}`);
  return { data: body, error: null };
};

export const getEmployees = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<EmployeeItemType[]>>("/employee", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_EMPLOYEE]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};