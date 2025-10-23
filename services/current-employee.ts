import * as actions from './api/actions';
import { RVK_CURRENT_EMPLOYEE } from './rvk';
import {} from './schema';

// Auto-generated service for current-employee

export async function readCurrentEmployee() {
  const res = await actions.get<any>(`/current-employee`, {
    next: {
      tags: [RVK_CURRENT_EMPLOYEE],
    },
  });

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}
