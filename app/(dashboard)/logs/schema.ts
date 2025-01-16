import { ID } from '@/lib/fetch/types';

export enum LogActionType {
  "created" = "created",
  "updated" = "updated",
  "deleted" = "deleted"
}
export enum LogTargetType {
  "album" = "album",
  "lecture" = "lecture",
  "package" = "package",
  "item" = "item",
  "lesson" = "lesson",
  "magazine" = "magazine",
  "magazineCategory" = "magazineCategory",
  "magazineArticle" = "magazineArticle",
  "book" = "book"
}

export type LogItemType = {
  id: ID;
  created_at: string;
  employee_id: ID;
  employee_username: string;
  action_type: LogActionType;
  details: string;
  target_type: LogTargetType;
  target_id: ID;
  user_id: ID | null;
  user_email: string | null;
  relatedDetails: {
    id: ID;
    title?: string;
    name?: string;
  }
}