import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Link } from "./custom/link";
import { SubMenuItemType } from "./constants/menu";

export function SidebarMenuGroup({
  items,
  label,
}: {
  label?: string;
  items: SubMenuItemType[];
}) {
  return (
    <SidebarGroup>
      {!!label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <>
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link
                    href={item.url}
                    withChildRoutes={
                      item.url.split("/").length > 1 || item.subRoutes
                    }
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    {item.icon && <item.icon />}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {!!item.children?.length && (
                <SidebarMenuSub key={item.title}>
                  {item.children.map((child) => (
                    <SidebarMenuSubItem key={child.title}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          href={child.url}
                          withChildRoutes={
                            child.url.split("/").length > 1 || child.subRoutes
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
            </>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
