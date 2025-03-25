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
  ShieldCheck,
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
  children?: Omit<SubMenuItemType, 'children'>[];
};

const managementRoutes: SubMenuItemType[] = [
  {
    title: 'Age Restrictions',
    url: '/age-restrictions',
    icon: Shield,
  },
  {
    title: 'Attribute Values',
    url: '/attribute-values',
    icon: Tag,
  },
  {
    title: 'Banners',
    url: '/banners',
    icon: Flag,
  },
  {
    title: 'Branches',
    url: '/branches',
    icon: GitBranch,
  },
  {
    title: 'Categories',
    url: '/category',
    icon: List,
  },
  {
    title: 'Category Attributes',
    url: '/category-attributes',
    icon: Layers,
  },
];

const companyRoutes: SubMenuItemType[] = [
  {
    title: 'Company',
    url: '/companies',
    icon: Building2,
  },
  {
    title: 'Employees',
    url: '/employees',
    icon: UserIcon,
  },
  {
    title: 'Company Categories',
    url: '/company-categories',
    icon: Combine,
  },
];

const operationsRoutes: SubMenuItemType[] = [
  {
    title: 'Discounts',
    url: '/discounts',
    icon: Percent,
  },
  {
    title: 'Halls',
    url: '/halls',
    icon: DoorOpen,
  },
  {
    title: 'Orders',
    url: '/orders',
    icon: ShoppingCart,
  },
];

const settingsRoutes: SubMenuItemType[] = [
  {
    title: 'Permissions',
    url: '/permission',
    icon: ShieldCheck,
  },
  {
    title: 'Roles',
    url: '/role',
    icon: UserCog,
  },
  {
    title: 'Venues',
    url: '/venues',
    icon: MapPin,
  },
];

export const menuData: Record<string, SubMenuItemType[]> = {
  management: managementRoutes,
  company: companyRoutes,
  operations: operationsRoutes,
  settings: settingsRoutes,
};
