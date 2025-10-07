import {
  ChartPie,
  Clapperboard,
  FilmIcon,
  GalleryVerticalEnd,
  GemIcon,
  ImagePlusIcon,
  LayoutGrid,
  type LucideIcon,
  TvMinimalPlay,
  UsersRoundIcon,
} from 'lucide-react';

export type SubMenuItemType = {
  title: string;
  url: string;
  icon?: LucideIcon;
  subRoutes?: boolean;
  permissions: string[];
  children?: Omit<SubMenuItemType, 'children'>[];
};

const operationsRoutes: SubMenuItemType[] = [
  {
    title: 'Кинонууд',
    url: '/movies',
    subRoutes: false,
    icon: FilmIcon,
    permissions: [],
  },
  {
    title: 'Ангилал',
    url: '/categories',
    icon: GalleryVerticalEnd,
    subRoutes: false,
    permissions: [],
  },
  {
    title: 'Genre',
    url: '/genres',
    icon: TvMinimalPlay,
    subRoutes: false,
    permissions: [],
  },
];

const organizationRoutes: SubMenuItemType[] = [
  {
    title: 'Багцтэй хэрэглэгчид',
    url: '/subscriptions',
    icon: GemIcon,
    permissions: [],
  },
  {
    title: 'Түрээсийн кино',
    url: '/rentals',
    icon: Clapperboard,
    permissions: [],
  },
  {
    title: 'Борлуулалт',
    url: '/sales',
    icon: ChartPie,
    permissions: [],
  },
  {
    title: 'Media manager',
    url: '/medias',
    icon: ImagePlusIcon,
    permissions: [],
  },
];

const systemAdminRoutes: SubMenuItemType[] = [
  {
    title: 'Үндсэн категори',
    url: '/categories',
    icon: LayoutGrid,
    subRoutes: true,
    permissions: [],
  },
  {
    title: 'Ажилчид',
    url: '/employees',
    icon: UsersRoundIcon,
    permissions: [],
  },
];

export const menuData: Record<string, SubMenuItemType[]> = {
  General_menu: operationsRoutes,
  organization: organizationRoutes,
  system_settings: systemAdminRoutes,
};

export const permissionsByRoute: Record<string, string[]> = flattenDeep(
  Object.values(menuData).map((c) => {
    const arr = c.map((cc) => cc.children || []);
    return [...arr, ...c];
  }),
).reduce(
  (acc: any, cur: any) => ({
    ...acc,
    [cur.url
      .split('/')
      .filter((cc: any) => !!cc)
      .join('/')]: cur.permissions,
  }),
  {},
);

export function flattenDeep(arr: any[]) {
  return arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flattenDeep(val) : val),
    [],
  );
}
