import * as actions from './api/actions';
import { RVK_SUBSCRIPTIONS } from './rvk';
import {} from './schema';

// Auto-generated service for subscriptions

export async function getSubscriptionUsers(
  searchParams: {
    status?: string;
    plan?: string;
    expires_after?: string;
    expires_before?: string;
    limit?: number;
    offset?: number;
  } = {},
) {
  const res = await actions.get<any>(`/subscriptions/users`, {
    searchParams,
    next: {
      tags: [RVK_SUBSCRIPTIONS],
    },
  });

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}
