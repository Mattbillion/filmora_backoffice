import {
  BadgePercent,
  CircleDollarSign,
  GalleryVertical,
  LayoutGrid,
  type LucideIcon,
  MapPin,
  MonitorCog,
  PackageIcon,
  Shield,
  ShoppingCart,
  Store,
  UserCog,
  UsersRoundIcon,
} from 'lucide-react';

export type SubMenuItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
  subRoutes?: boolean;
  permissions: string[];
  children?: Omit<SubMenuItemType, 'children'>[];
};

const productManagerRoutes: SubMenuItemType[] = [
  {
    title: 'Мерчиндайз бараа',
    url: '/merchandises',
    subRoutes: true,
    icon: PackageIcon,
    permissions: [
      'company_merchandise_list',
      'get_company_merchandise_list',
      'get_company_merchandise',
      'create_company_merchandise',
      'update_company_merchandise',
      'delete_company_merchandise',
      // variants
      'get_company_merchandise_attribute_value_list',
      'get_company_merchandise_attribute_value',
      'create_company_merchandise_attribute_value',
      'update_company_merchandise_attribute_value',
      'delete_company_merchandise_attribute_value',
      // variant attributes
      'get_company_merchandise_attribute_option_value_list',
      'get_company_merchandise_attribute_option_value',
      'create_company_merchandise_attribute_option_value',
      'update_company_merchandise_attribute_option_value',
      'delete_company_merchandise_attribute_option_value',
    ],
  },
  {
    title: 'Эвент & Тоглолт',
    url: '/events',
    icon: MapPin,
    permissions: [
      'get_event_list',
      'get_event',
      'create_event',
      'update_event',
      'delete_event',
      'create_event_schedule',
    ],
  },
  {
    title: 'Хямдралууд',
    url: '/discounts',
    icon: BadgePercent,
    permissions: [
      'get_discount_list',
      'get_discount',
      'create_discount',
      'update_discount',
      'delete_discount',
    ],
  },
  // {
  //   title: 'Merch attributes',
  //   url: '/merchandises/attributes',
  //   icon: Shield,
  //   permissions: [
  //     // 'get_merchandise_attribute_list',
  //     // 'get_merchandise_attribute',
  //     // 'create_merchandise_attribute',
  //     // 'update_merchandise_attribute',
  //     // 'delete_merchandise_attribute',
  //     'get_company_merchandise_attribute_value_list',
  //     'get_company_merchandise_attribute_value',
  //     'create_company_merchandise_attribute_value',
  //     'update_company_merchandise_attribute_value',
  //     'delete_company_merchandise_attribute_value',
  //   ],
  // },
];

const companyRoutes: SubMenuItemType[] = [
  {
    title: 'Merchants',
    url: '/companies',
    icon: Store,
    permissions: [
      'get_company_list',
      'get_company',
      'create_company',
      'update_company',
      'delete_company',
    ],
  },
];

const operationsRoutes: SubMenuItemType[] = [
  {
    title: 'Захиалгууд',
    url: '/orders',
    subRoutes: true,
    icon: ShoppingCart,
    permissions: ['get_order_list', 'get_order_detail'],
  },
  {
    title: 'Гүйлгээ',
    url: '/transactions',
    icon: CircleDollarSign,
    subRoutes: true,
    permissions: ['get_transaction_list', 'get_transaction_detail'],
  },
];

const organizationRoutes: SubMenuItemType[] = [
  {
    title: 'Ажилчид',
    url: '/employees',
    icon: UsersRoundIcon,
    permissions: [
      'get_employees_list',
      'get_all_company_employees',
      'get_company_employee_info',
      'create_company_employee',
      'update_company_employee',
      'update_company_employee_email',
      'update_company_employee_password',
      'delete_company_employee',
      'set_company_employee_role',
    ],
  },
];

const settingsRoutes: SubMenuItemType[] = [
  {
    title: 'Venues',
    url: '/venues',
    icon: MapPin,
    subRoutes: true,
    permissions: [
      'get_venues_list',
      'get_venue',
      'create_venue',
      'update_venue',
      'delete_venue',
    ],
  },
];

const systemAdminRoutes: SubMenuItemType[] = [
  {
    title: 'Үндсэн категори',
    url: '/categories',
    icon: LayoutGrid,
    subRoutes: true,
    permissions: [
      'get_category_list',
      'get_category',
      'create_category',
      'update_category',
      'delete_category',
      'get_category_attribute_value_list',
      'get_category_attribute_value',
      'create_category_attribute_value',
      'update_category_attribute_value',
      'delete_category_attribute_value',
    ],
  },
  {
    title: 'Компани категори сонгох',
    url: '/company-categories',
    icon: MonitorCog,
    permissions: [
      'get_company_category_list',
      'get_company_category',
      'create_company_category',
      'update_company_category',
      'delete_company_category',
    ],
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
    permissions: [
      'get_role_list',
      'get_permission_list',
      'create_role',
      'get_all_role_by_permission_list',
      'get_role_by_permission_list',
      'create_role_permission',
      'delete_role_permission',
    ],
  },
  {
    title: 'Age Restrictions',
    url: '/age-restrictions',
    icon: Shield,
    permissions: [
      'get_age_restriction_list',
      'get_age_restriction',
      'create_age_restriction',
      'update_age_restriction',
      'delete_age_restriction',
    ],
  },
];

export const menuData: Record<string, SubMenuItemType[]> = {
  order_manager: operationsRoutes,
  product_manager: productManagerRoutes,
  organization: organizationRoutes,
  vendor_manager: companyRoutes,
  settings: settingsRoutes,
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
