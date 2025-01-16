import { goodaliFetch } from "@/lib/fetch";
import { RVK_BOOK, BookBodyType, BookItemType } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import { executeRevalidate } from "@/lib/goodali";

export const createBook = async (bodyData: BookBodyType) => {
  const { body, error } = await goodaliFetch<{data: BookItemType}>("book", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);

  executeRevalidate([RVK_BOOK]);
  executeRevalidate([{tag: "books"}, {path: `/books`}]);
  return { data: body, error: null };
};

export const patchBook = async ({ id, ...bodyData }: BookBodyType & { id: ID; }) => {
  const { body, error } =  await goodaliFetch<{data: BookItemType}>(`/book/${id}`,{
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_BOOK]);
  executeRevalidate([{tag: "books"}, {path: `/books`}, {path: `/books/${id}`}]);
  return { data: body, error: null };
};

export const deleteBook = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/book/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });
  
  if(error) throw new Error(error);
  
  executeRevalidate([RVK_BOOK]);
  executeRevalidate([{tag: "books"}, {path: `/books`}, {path: `/books/${id}`}]);
  return { data: body, error: null };
};

export const getBooks = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<BookItemType[]>>("/book", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_BOOK]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching books:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
