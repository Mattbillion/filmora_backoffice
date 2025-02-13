/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ComponentProps, Suspense, useEffect } from 'react';
import { sentenceCase } from 'change-case-all';
import { useSession } from 'next-auth/react';

import { menuData } from '@/components/constants/menu';
import { NavUser } from '@/components/nav-user';
import { SidebarMenuGroup } from '@/components/sidebar-menu-group';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

import RevalidateMenu from './revalidate-menu';

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { data: session, update } = useSession();

  useEffect(() => {
    update();
  }, []);

  // const mainMenu = menuData.navMain
  //   .map((c) =>
  //     hasPagePermission(role, c.url.replace("/", "") as any) ? c : null
  //   )
  //   .filter((c) => !!c);
  // const adminMenu = menuData.navAdmin
  //   .map((c) =>
  //     hasPagePermission(role, c.url.replace("/", "") as any) ? c : null
  //   )
  //   .filter((c) => !!c);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {/*{!!mainMenu?.length && (*/}
        {/*  <Suspense>*/}
        {/*    <SidebarMenuGroup items={mainMenu} label="Dashboard" />*/}
        {/*  </Suspense>*/}
        {/*)}*/}
        {/*{!!adminMenu?.length && (*/}
        {/*  <Suspense>*/}
        {/*    <SidebarMenuGroup items={adminMenu} label="Administration" />*/}
        {/*  </Suspense>*/}
        {/*)}*/}
        {Object.entries(menuData).map(([group, menus], idx) => (
          <Suspense key={idx}>
            <SidebarMenuGroup items={menus} label={sentenceCase(group)} />
          </Suspense>
        ))}
        <RevalidateMenu />
      </SidebarContent>
      <SidebarFooter>{session && <NavUser session={session} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
