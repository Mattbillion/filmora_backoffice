import { goodaliFetch } from "@/lib/fetch";
import { RVK_ALBUM, AlbumBodyType, AlbumItemType } from "./schema";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { ID, PaginatedResType } from "@/lib/fetch/types";
import {executeRevalidate} from "@/lib/goodali";

export const createAlbum = async (bodyData: AlbumBodyType) => {
  const { body, error } = await goodaliFetch<{data: AlbumItemType}>("album", {
    method: "POST",
    body: bodyData,
    cache: "no-store",
  });
  
  if(error) throw new Error(error);

  executeRevalidate([RVK_ALBUM])
  executeRevalidate([{tag: "albums"}, {path: `/albums/${body.data.id}`}])
  return { data: body, error: null };
};

export const patchAlbum = async ({ id, ...bodyData }: AlbumBodyType & { id: ID; }) => {
  const { body, error } =  await goodaliFetch<{data: AlbumItemType}>(`/album/${id}`,{
    method: "PATCH",
    body: bodyData,
    cache: "no-store",
  });

  if(error) throw new Error(error);


  executeRevalidate([RVK_ALBUM, `${RVK_ALBUM}_${id}`])
  executeRevalidate([{tag: "albums"}, {path: `/albums/${id}`}])
  return { data: body, error: null };
};

export const deleteAlbum = async (id: ID) => {
  const { body, error } =  await goodaliFetch(`/album/${id}`,{
    method: "DELETE",
    cache: "no-store",
  });

  if(error) throw new Error(error);

  executeRevalidate([RVK_ALBUM, `${RVK_ALBUM}_${id}`])
  executeRevalidate([{tag: "albums"}, {path: `/albums/${id}`}])
  return { data: body, error: null };
};

export const getAlbums = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<AlbumItemType[]>>("/album", {
      method: "GET",
      searchParams,
      next: {tags: [RVK_ALBUM]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching albums:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getAlbum = async (albumId: string) => {
  try {
    const { body, error } = await goodaliFetch<{data: AlbumItemType}>(`/album/${albumId}`, {
      method: "GET",
      next: {tags: [`${RVK_ALBUM}_${albumId}`]}
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching albums:", error);
    return { data: null, error };
  }
};
