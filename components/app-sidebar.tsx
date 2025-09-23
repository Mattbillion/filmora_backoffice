'use client';

import { ComponentProps, Suspense, useEffect } from 'react';
import { sentenceCase } from 'change-case-all';
import { Command as CommandIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { menuData } from '@/components/constants/menu';
import { NavUser } from '@/components/nav-user';
import { SidebarMenuGroup } from '@/components/sidebar-menu-group';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { checkPermission } from '@/lib/permission';

import RevalidateMenu from './revalidate-menu';

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { data: session, update } = useSession();

  useEffect(() => {
    update();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2 group-data-[state=collapsed]:overflow-hidden group-data-[state=collapsed]:px-0">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg group-data-[state=collapsed]:size-7">
            <CommandIcon className="size-4" />
          </div>
          <div className="flex-1 text-left text-sm leading-tight">
            <p className="truncate font-semibold">
              {session?.user?.company_name || 'FILMORA'}
            </p>
            {session?.user?.company_register && (
              <p className="text-muted-foreground text-xs">
                {session?.user?.company_register}
              </p>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(menuData).map(([group, menus], idx) => (
          <Suspense key={idx}>
            <SidebarMenuGroup
              items={menus.filter((c) =>
                checkPermission(session, c.permissions),
              )}
              label={sentenceCase(group)}
            />
          </Suspense>
        ))}
        <RevalidateMenu />
      </SidebarContent>
      <SidebarFooter>{session && <NavUser session={session} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
