import { Fragment } from 'react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import { SubMenuItemType } from './constants/menu';
import { Link } from './custom/link';

export function SidebarMenuGroup({
  items,
  label,
}: {
  label?: string;
  items: SubMenuItemType[];
}) {
  if (!items.length) return null;
  return (
    <SidebarGroup>
      {!!label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, idx) => (
            <Fragment key={idx}>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link
                    href={item.url}
                    withChildRoutes={
                      item.url.split('/').length > 1 || item.subRoutes
                    }
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    {item.icon && <item.icon />}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {!!item.children?.length && (
                <SidebarMenuSub>
                  {item.children.map((child) => (
                    <SidebarMenuSubItem key={child.title}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          href={child.url}
                          withChildRoutes={
                            child.url.split('/').length > 1 || child.subRoutes
                          }
                          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                        >
                          {child.icon && <child.icon />}
                          {child.title}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </Fragment>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
