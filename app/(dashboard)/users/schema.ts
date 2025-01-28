import { BaseType, PrettyType } from '@/lib/fetch/types';

export type UserItemType = PrettyType<
  BaseType<{
    email: string;
    nickname: string;
    avatar: string;
    status: number;
  }>
>;

export const RVK_USER = 'users';
