import { goodaliFetch } from "@/lib/fetch";
import { UserItemType } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";

export const getUsers = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<UserItemType[]>>("/users", {
      method: "GET",
      searchParams,
      cache: "no-store"
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const lockUser = async (id: ID) => {
  const { body, error } = await goodaliFetch(`/users/${id}/lock`, {
    method: "POST",
    cache: "no-store"
  });

  if (error) throw new Error(error);

  return { data: body };
};

export const unlockUser = async (id: ID) => {
  const { body, error } = await goodaliFetch(`/users/${id}/unlock`, {
    method: "POST",
    cache: "no-store"
  });

  if (error) throw new Error(error);
  
  return { data: body };
};