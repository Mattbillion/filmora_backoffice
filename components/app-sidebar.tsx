/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
// import { SidebarMenuGroup } from "@/components/sidebar-menu-group";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import RevalidateMenu from "./revalidate-menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <RevalidateMenu />
      </SidebarContent>
      <SidebarFooter>{session && <NavUser session={session} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
