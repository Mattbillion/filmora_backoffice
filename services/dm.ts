import * as actions from './api/actions';
import { RVK_DM } from './rvk';
import { BaseResponseListDictStrAnyType } from './schema';

// Auto-generated service for dm

export async function getRbacMap() {
  const res = await actions.get<BaseResponseListDictStrAnyType>(`/dm`, {
    next: {
      tags: [RVK_DM],
    },
  });

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}
