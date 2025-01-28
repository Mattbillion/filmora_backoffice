import { BaseType, ID, PrettyType } from '@/lib/fetch/types';

export type UserType = PrettyType<
  BaseType<{
    email: string;
    nickname: string;
    avatar: string;
    status: number;
  }>
>;

export type PurchaseItemType = PrettyType<
  BaseType<{
    name: string;
    category_type: PurchaseTypeEnum;
    user_id: ID;
    product_id: ID;
    openedDate?: string;
    expireDate?: string;
  }>
>;

export const purchaseTypeObj = {
  0: 'Album',
  1: 'Lecture',
  3: 'Book',
  4: 'Package',
};

export type PurchaseTypeEnum = keyof typeof purchaseTypeObj;
