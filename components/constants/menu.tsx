import {
  ChartPieIcon,
  CircleDollarSign,
  FilmIcon,
  GalleryVertical,
  LayoutGrid,
  type LucideIcon,
  UserCog,
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

const productManagerRoutes: SubMenuItemType[] = [
  {
    title: 'Тайлан',
    url: '/reports/company-sales',
    icon: ChartPieIcon,
    subRoutes: true,
    permissions: [],
    children: [],
  },
];

const operationsRoutes: SubMenuItemType[] = [
  {
    title: 'Кинонууд',
    url: '/movies',
    subRoutes: true,
    icon: FilmIcon,
    permissions: ['get_order_list', 'get_order_detail'],
  },
  {
    title: 'Гүйлгээ',
    url: '/transactions',
    icon: CircleDollarSign,
    subRoutes: true,
    permissions: [],
  },
];

const organizationRoutes: SubMenuItemType[] = [
  {
    title: 'Ажилчид',
    url: '/employees',
    icon: UsersRoundIcon,
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
    title: 'Баннер оруулах',
    url: '/banners',
    icon: GalleryVertical,
    permissions: [
      'get_banner_list',
      'get_banner',
      'create_banner',
      'update_banner',
      'delete_banner',
    ],
  },
  {
    title: 'Role',
    url: '/role',
    icon: UserCog,
    permissions: [],
  },
];

export const menuData: Record<string, SubMenuItemType[]> = {
  order_manager: operationsRoutes,
  product_manager: productManagerRoutes,
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
