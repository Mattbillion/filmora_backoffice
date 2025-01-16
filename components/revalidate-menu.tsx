"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { revalidateAll, revalidateGoodali } from "@/lib/functions";
import { getOrigin } from "@/lib/xoox";
import { ListRestart, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function RevalidateMenu() {
  const [loading, setLoading] = useState(false);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Revalidation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Refresh xoox.mn and dashboard data"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                Promise.all([
                  revalidateAll(),
                  revalidateGoodali({}, getOrigin()),
                ])
                  .then(() => toast.success("Revalidate successfully"))
                  .finally(() => setLoading(false));
              }}
            >
              {loading ? <Loader2 className="animate-spin" /> : <ListRestart />}
              Revalidate
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
