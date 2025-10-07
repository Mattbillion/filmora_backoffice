import { type Session } from 'next-auth';

import {
  operationsRoutes,
  organizationRoutes,
  systemAdminRoutes,
} from '@/components/constants/menu';

import { PrettyType } from './fetch/types';

export const role = {
  admin: 'Admin',
  editor: 'Editor',
  moderator: 'Moderator',
  support: 'Moderator',
};

type AdminMenuItemType = (typeof systemAdminRoutes)[number];
type OperationMenuItemType = (typeof operationsRoutes)[number];
type OrgMenuItemType = (typeof organizationRoutes)[number];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MenuUrlEnum<T extends Record<any, any>> = { [K in keyof T]: T[K] }['url'];
type RemoveSlash<T extends string> = T extends `/${infer Rest}` ? Rest : T;
type UrlEnumType = RemoveSlash<
  | MenuUrlEnum<AdminMenuItemType>
  | MenuUrlEnum<OperationMenuItemType>
  | MenuUrlEnum<OrgMenuItemType>
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const subjects = {
  categories: [],
  employees: [],
  rentals: [],
  sales: [],
  medias: [],
  movies: ['detail', 'sessions', 'session-detail'],
  genres: [],
  subscriptions: [],
  tags: [],
} as const satisfies Record<UrlEnumType, string[]>;

type FilterNonEmtArr<T extends Record<string, readonly string[]>> = {
  [K in keyof T]: T[K] extends readonly [] & { length: 0 } ? never : K;
}[keyof T];

type EnumLikeType<T extends Record<string, readonly string[]>> = {
  [K in keyof T]: T[K] extends readonly [] & { length: 0 }
    ? K
    : `${K & string}.${T[K][number]}`;
}[keyof T];

export type Role = keyof typeof role;
type Action = 'create' | 'read' | 'update' | 'delete';
export type Subject = PrettyType<
  EnumLikeType<typeof subjects> | FilterNonEmtArr<typeof subjects>
>;

const restricted = { create: false, delete: false, read: false, update: false };
const full = { create: true, delete: true, read: true, update: true };
const modify = { ...restricted, create: true, read: true, update: true };
const read = { ...restricted, read: true };

const roles: Record<Role, Record<Subject, Record<Action, boolean>>> = {
  admin: {
    categories: full,
    employees: full,
    rentals: full,
    sales: full,
    medias: full,
    movies: full,
    'movies.detail': full,
    'movies.sessions': full,
    'movies.session-detail': full,
    genres: full,
    subscriptions: full,
    tags: full,
  },
  editor: {
    categories: modify,
    genres: full,
    medias: full,
    movies: modify,
    'movies.detail': modify,
    'movies.sessions': modify,
    'movies.session-detail': modify,
    tags: modify,
    employees: restricted,
    rentals: restricted,
    sales: restricted,
    subscriptions: restricted,
  },
  moderator: {
    categories: read,
    genres: read,
    medias: read,
    movies: read,
    'movies.detail': read,
    'movies.sessions': read,
    'movies.session-detail': read,
    tags: read,
    employees: restricted,
    rentals: read,
    sales: read,
    subscriptions: read,
  },
  support: {
    categories: read,
    genres: read,
    medias: read,
    movies: read,
    'movies.detail': read,
    'movies.sessions': read,
    'movies.session-detail': read,
    tags: read,
    employees: restricted,
    rentals: restricted,
    sales: restricted,
    subscriptions: restricted,
  },
};

export const hasPermission = (
  session: Session | null = null,
  subject: Subject,
  action: Action,
) => {
  const r = session?.user?.role as Role | undefined;
  if (!r) return false;
  return !!roles[r]?.[subject]?.[action];
};

export const hasPagePermission = (
  session: Session | null = null,
  subject: Subject,
) => {
  const r = session?.user?.role as Role | undefined;
  if (!r) return false;
  return Object.values(roles[r]?.[subject] ?? {}).some((c) => c);
};
