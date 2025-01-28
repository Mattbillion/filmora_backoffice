import { navAdmin,navMain } from '@/components/constants/menu';

import { PrettyType } from './fetch/types';

export const role = {
  manager: 'Manager',
  operator: 'Operator',
  content: 'Content admin',
};

export const roleMap = {
  manager: 'manager',
  operator: 'operator',
  content: 'content',
  0: 'content',
  1: 'manager',
  2: 'operator',
};

type MainMenuItemType = (typeof navMain)[number];
type AdminMenuItemType = (typeof navAdmin)[number];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MenuUrlEnum<T extends Record<any, any>> = { [K in keyof T]: T[K] }['url'];
type RemoveSlash<T extends string> = T extends `/${infer Rest}` ? Rest : T;
type UrlEnumType = RemoveSlash<
  MenuUrlEnum<MainMenuItemType> | MenuUrlEnum<AdminMenuItemType>
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const subjects = {
  albums: ['lectures'],
  article: [],
  banners: [],
  books: [],
  employees: [],
  faqs: [],
  moods: ['item', 'list'],
  orders: [],
  podcasts: [],
  tags: [],
  trainings: ['items', 'lessons', 'packages', 'tasks'],
  users: ['detail', 'connect', 'toggleLock'],
  videos: [],
  logs: [],
  magazines: ['articles', 'category'],
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

const resticted = { create: false, delete: false, read: false, update: false };
const full = { create: true, delete: true, read: true, update: true };
const modify = { ...resticted, create: true, read: true, update: true };
const create = { ...resticted, create: true, read: true };
const update = { ...resticted, update: true, read: true };

const roles: Record<Role, Record<Subject, Record<Action, boolean>>> = {
  manager: {
    albums: full,
    'albums.lectures': full,
    article: full,
    banners: full,
    books: full,
    employees: full,
    faqs: full,
    'moods.item': full,
    'moods.list': full,
    moods: full,
    orders: full,
    podcasts: full,
    tags: full,
    trainings: full,
    'trainings.items': full,
    'trainings.lessons': full,
    'trainings.packages': full,
    'trainings.tasks': full,
    users: full,
    'users.detail': full,
    'users.connect': full,
    'users.toggleLock': full,
    videos: full,
    logs: full,
    magazines: full,
    'magazines.articles': full,
    'magazines.category': full,
  },
  operator: {
    albums: modify,
    'albums.lectures': modify,
    article: modify,
    banners: modify,
    books: modify,
    employees: modify,
    faqs: modify,
    'moods.item': modify,
    'moods.list': modify,
    moods: modify,
    orders: full,
    podcasts: modify,
    tags: modify,
    trainings: modify,
    'trainings.items': modify,
    'trainings.lessons': modify,
    'trainings.packages': modify,
    'trainings.tasks': modify,
    users: full,
    'users.detail': full,
    'users.connect': full,
    'users.toggleLock': full,
    videos: modify,
    logs: resticted,
    magazines: modify,
    'magazines.articles': modify,
    'magazines.category': modify,
  },
  content: {
    albums: update,
    'albums.lectures': update,
    article: create,
    banners: create,
    books: update,
    employees: resticted,
    faqs: update,
    'moods.item': create,
    'moods.list': create,
    moods: create,
    orders: resticted,
    podcasts: create,
    tags: update,
    trainings: update,
    'trainings.items': update,
    'trainings.lessons': update,
    'trainings.packages': update,
    'trainings.tasks': update,
    users: resticted,
    'users.detail': resticted,
    'users.connect': resticted,
    'users.toggleLock': resticted,
    logs: resticted,
    videos: create,
    magazines: create,
    'magazines.articles': create,
    'magazines.category': create,
  },
};

export const hasPermission = (r: Role, subject: Subject, action: Action) =>
  !!roles[r]?.[subject]?.[action];

export const hasPagePermission = (r: Role, subject: Subject) =>
  !!Object.values(roles[r]?.[subject] ?? {}).some((c) => !!c);
