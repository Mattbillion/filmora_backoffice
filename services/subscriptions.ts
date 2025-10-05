import * as actions from './api/actions';
import { RVK_SUBSCRIPTIONS } from './rvk';
import { BaseResponseUnionListSubscriptionUserDataNoneTypeType } from './schema';

// Auto-generated service for subscriptions

export type GetSubscriptionUsersSearchParams = {
  status?: string;
  plan?: string;
  expires_after?: string;
  expires_before?: string;
  limit?: number;
  offset?: number;
};

export async function getSubscriptionUsers(
  searchParams?: GetSubscriptionUsersSearchParams,
) {
  const res =
    await actions.get<BaseResponseUnionListSubscriptionUserDataNoneTypeType>(
      `/subscriptions/users`,
      {
        searchParams,
        next: {
          tags: [RVK_SUBSCRIPTIONS],
        },
      },
    );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}
