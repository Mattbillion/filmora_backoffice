import { flattenDeep } from 'lodash';
import {
  Building2,
  Combine,
  DoorOpen,
  Flag,
  GitBranch,
  Layers,
  List,
  type LucideIcon,
  MapPin,
  Percent,
  Shield,
  ShoppingCart,
  Tag,
  UserCog,
  UserIcon,
} from 'lucide-react';

export type SubMenuItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
  subRoutes?: boolean;
  permissions: string[];
  children?: Omit<SubMenuItemType, 'children'>[];
};

const managementRoutes: SubMenuItemType[] = [
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
  {
    title: 'Merch',
    url: '/merchandises',
    icon: Shield,
    permissions: [
      'company_merchandise_list',
      'get_company_merchandise_list',
      'get_company_merchandise',
      'create_company_merchandise',
      'update_company_merchandise',
      'delete_company_merchandise',
    ],
  },
  {
    title: 'Merch attributes',
    url: '/merchandises/attributes',
    icon: Shield,
    permissions: [
      // 'get_merchandise_attribute_list',
      // 'get_merchandise_attribute',
      // 'create_merchandise_attribute',
      // 'update_merchandise_attribute',
      // 'delete_merchandise_attribute',
      'get_company_merchandise_attribute_value_list',
      'get_company_merchandise_attribute_value',
      'create_company_merchandise_attribute_value',
      'update_company_merchandise_attribute_value',
      'delete_company_merchandise_attribute_value',
    ],
  },
  {
    title: 'Merch attributes values',
    url: '/merchandises/attributes/values',
    icon: Shield,
    permissions: [
      'get_company_merchandise_attribute_option_value_list',
      'get_company_merchandise_attribute_option_value',
      'create_company_merchandise_attribute_option_value',
      'update_company_merchandise_attribute_option_value',
      'delete_company_merchandise_attribute_option_value',
    ],
  },
  {
    title: 'Attribute Values',
    url: '/attribute-values',
    icon: Tag,
    permissions: [
      'get_category_attribute_value_list',
      'get_category_attribute_value',
      'create_category_attribute_value',
      'update_category_attribute_value',
      'delete_category_attribute_value',
    ],
  },
  {
    title: 'Banners',
    url: '/banners',
    icon: Flag,
    permissions: [
      'get_banner_list',
      'get_banner',
      'create_banner',
      'update_banner',
      'delete_banner',
    ],
  },
  {
    title: 'Branches',
    url: '/branches',
    icon: GitBranch,
    permissions: [
      'get_branch_list',
      'get_branch',
      'create_branch',
      'update_branch',
      'delete_branch',
    ],
  },
  {
    title: 'Categories',
    url: '/category',
    icon: List,
    permissions: [
      'get_category_list',
      'get_category',
      'create_category',
      'update_category',
      'delete_category',
    ],
  },
  {
    title: 'Category Attributes',
    url: '/category-attributes',
    icon: Layers,
    permissions: [
      'get_category_attribute_list',
      'get_category_attribute',
      'create_category_attribute',
      'update_category_attribute',
      'delete_category_attribute',
    ],
  },
];

const companyRoutes: SubMenuItemType[] = [
  {
    title: 'Company',
    url: '/companies',
    icon: Building2,
    permissions: [
      'get_company_list',
      'get_company',
      'create_company',
      'update_company',
      'delete_company',
    ],
  },
  {
    title: 'Employees',
    url: '/employees',
    icon: UserIcon,
    permissions: [
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
  {
    title: 'Company Categories',
    url: '/company-categories',
    icon: Combine,
    permissions: [
      'get_company_category_list',
      'get_company_category',
      'create_company_category',
      'update_company_category',
      'delete_company_category',
    ],
  },
];

const operationsRoutes: SubMenuItemType[] = [
  {
    title: 'Discounts',
    url: '/discounts',
    icon: Percent,
    permissions: [
      'get_discount_list',
      'get_discount',
      'create_discount',
      'update_discount',
      'delete_discount',
    ],
  },
  {
    title: 'Halls',
    url: '/halls',
    icon: DoorOpen,
    permissions: [
      'get_hall_list',
      'get_hall',
      'create_hall',
      'update_hall',
      'delete_hall',
    ],
  },
  {
    title: 'Orders',
    url: '/orders',
    icon: ShoppingCart,
    permissions: ['get_order_list', 'get_order_detail'],
  },
];

const settingsRoutes: SubMenuItemType[] = [
  {
    title: 'Roles',
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
    title: 'Venues',
    url: '/venues',
    icon: MapPin,
    permissions: [
      'get_venues_list',
      'get_venue',
      'create_venue',
      'update_venue',
      'delete_venue',
    ],
  },
  {
    title: 'Events',
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
];

export const menuData: Record<string, SubMenuItemType[]> = {
  management: managementRoutes,
  company: companyRoutes,
  operations: operationsRoutes,
  settings: settingsRoutes,
};

export const permissionsByRoute: Record<string, string[]> = flattenDeep(
  Object.values(menuData).map((c) => {
    const arr = c.map((cc) => cc.children || []);
    return [...arr, ...c];
  }),
).reduce(
  (acc, cur) => ({
    ...acc,
    [cur.url
      .split('/')
      .filter((cc) => !!cc)
      .join('/')]: cur.permissions,
  }),
  {},
);

// console.log(permissionsByRoute);

// console.log(
//   [
//     'get_category_attribute_value',
//     'create_category_attribute_value',
//     'update_category_attribute_value',
//     'delete_category_attribute_value',
//     'get_company_merchandise_attribute_value_list',
//     'get_company_merchandise_attribute_value',
//     'create_company_merchandise_attribute_value',
//     'update_company_merchandise_attribute_value',
//     'delete_company_merchandise_attribute_value',
//     'access_admin_settings',
//     'get_permission_list',
//     'get_role_list',
//     'create_role',
//     'get_all_role_by_permission_list',
//     'get_role_by_permission_list',
//     'create_role_permission',
//     'delete_role_permission',
//     'get_all_company_employees',
//     'get_company_employee_info',
//     'create_company_employee',
//     'update_company_employee',
//     'update_company_employee_email',
//     'update_company_employee_password',
//     'delete_company_employee',
//     'set_company_employee_role',
//     'get_company_merchandise_list',
//     'get_company_merchandise',
//     'create_company_merchandise',
//     'update_company_merchandise',
//     'delete_company_merchandise',
//     'get_banner_list',
//     'get_banner',
//     'create_banner',
//     'update_banner',
//     'delete_banner',
//     'get_company_list',
//     'get_company',
//     'create_company',
//     'update_company',
//     'delete_company',
//     'get_venues_list',
//     'get_venue',
//     'create_venue',
//     'update_venue',
//     'delete_venue',
//     'get_branch_list',
//     'get_branch',
//     'create_branch',
//     'update_branch',
//     'delete_branch',
//     'get_hall_list',
//     'get_hall',
//     'create_hall',
//     'update_hall',
//     'delete_hall',
//     'get_category_list',
//     'get_category',
//     'create_category',
//     'update_category',
//     'delete_category',
//     'get_company_category_list',
//     'get_company_category',
//     'create_company_category',
//     'update_company_category',
//     'delete_company_category',
//     'get_age_restriction_list',
//     'get_age_restriction',
//     'create_age_restriction',
//     'update_age_restriction',
//     'delete_age_restriction',
//     'get_event_list',
//     'get_event',
//     'create_event',
//     'update_event',
//     'delete_event',
//     'create_event_schedule',
//     'get_order_list',
//     'get_order_detail',
//     'get_discount_list',
//     'get_discount',
//     'create_discount',
//     'update_discount',
//     'delete_discount',
//     'get_category_attribute_list',
//     'get_category_attribute',
//     'create_category_attribute',
//     'update_category_attribute',
//     'delete_category_attribute',
//     'get_category_attribute_value_list',
//     'get_company_merchandise_attribute_option_value_list',
//     'get_company_merchandise_attribute_option_value',
//     'create_company_merchandise_attribute_option_value',
//     'update_company_merchandise_attribute_option_value',
//     'delete_company_merchandise_attribute_option_value',
//   ].filter((c) => !flattenDeep(Object.values(permissionsByRoute)).includes(c)),
// );
