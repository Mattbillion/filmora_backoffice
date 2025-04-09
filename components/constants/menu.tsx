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
  permissionName: string;
  children?: Omit<SubMenuItemType, 'children'>[];
};

const managementRoutes: SubMenuItemType[] = [
  {
    title: 'Age Restrictions',
    url: '/age-restrictions',
    icon: Shield,
    permissionName: '',
  },
  {
    title: 'Attribute Values',
    url: '/attribute-values',
    icon: Tag,
    permissionName: '',
  },
  {
    title: 'Banners',
    url: '/banners',
    icon: Flag,
    permissionName: '',
  },
  {
    title: 'Branches',
    url: '/branches',
    icon: GitBranch,
    permissionName: '',
  },
  {
    title: 'Categories',
    url: '/category',
    icon: List,
    permissionName: '',
  },
  {
    title: 'Category Attributes',
    url: '/category-attributes',
    icon: Layers,
    permissionName: '',
  },
];

const companyRoutes: SubMenuItemType[] = [
  {
    title: 'Company',
    url: '/companies',
    icon: Building2,
    permissionName: '',
  },
  {
    title: 'Employees',
    url: '/employees',
    icon: UserIcon,
    permissionName: 'get_all_company_employees',
  },
  {
    title: 'Company Categories',
    url: '/company-categories',
    icon: Combine,
    permissionName: '',
  },
];

const operationsRoutes: SubMenuItemType[] = [
  {
    title: 'Discounts',
    url: '/discounts',
    icon: Percent,
    permissionName: '',
  },
  {
    title: 'Halls',
    url: '/halls',
    icon: DoorOpen,
    permissionName: '',
  },
  {
    title: 'Orders',
    url: '/orders',
    icon: ShoppingCart,
    permissionName: '',
  },
];

const settingsRoutes: SubMenuItemType[] = [
  {
    title: 'Roles',
    url: '/role',
    icon: UserCog,
    permissionName: 'get_role_list',
  },
  {
    title: 'Venues',
    url: '/venues',
    icon: MapPin,
    permissionName: 'get_venues_list',
  },
];

export const menuData: Record<string, SubMenuItemType[]> = {
  management: managementRoutes,
  company: companyRoutes,
  operations: operationsRoutes,
  settings: settingsRoutes,
};
