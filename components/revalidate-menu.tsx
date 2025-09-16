'use client';

import { useState } from 'react';
import { ListRestart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { getOrigin } from '@/lib/filmora';
import { revalidateClient, revalidateLocal } from '@/lib/functions';

export default function RevalidateMenu() {
  const [loading, setLoading] = useState(false);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Revalidation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Refresh filmora.mn and dashboard data"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                Promise.all([revalidateLocal(), revalidateClient(getOrigin())])
                  .then(() => toast.success('Revalidate successfully'))
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
