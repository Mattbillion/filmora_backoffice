'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Command } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { getCompanyList } from '@/features/companies/actions';
import { CompanyItemType } from '@/features/companies/schema';
import { isUri } from '@/lib/utils';

export function TeamSwitcher() {
  const [companies, setCompanies] = useState<CompanyItemType[]>([]);
  const { data: session, update: updateSession } = useSession();

  useEffect(() => {
    if (session?.user?.role === 'Super_Admin') {
      getCompanyList().then((c) => setCompanies(c.data.data));
    }
  }, [session]);

  const selectedCompany = companies.find(
    (c) => c.id === session?.user?.company_id,
  );
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {isUri(selectedCompany?.company_logo || '') ? (
                  <Image
                    src={selectedCompany?.company_logo!}
                    width={16}
                    height={16}
                    alt={`${selectedCompany?.company_name} logo`}
                    className="overflow-hidden object-cover"
                  />
                ) : (
                  <Command className="size-4" />
                )}
              </div>
              <div className="flex-1 text-left text-sm leading-tight">
                <p className="truncate font-semibold">
                  {selectedCompany?.company_name || 'XOOX'}
                </p>
                {selectedCompany?.company_register && (
                  <p className="text-xs text-muted-foreground">
                    {selectedCompany?.company_register}
                  </p>
                )}
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {session?.user?.role === 'Super_Admin' && (
            <DropdownMenuContent className="w-full">
              {companies?.map((c, idx) => (
                <DropdownMenuItem
                  onClick={() =>
                    updateSession({
                      ...session,
                      user: { ...session.user, company_id: c.id },
                    })
                  }
                  key={idx}
                  disabled={session.user.company_id === c.id}
                  className={`flex items-center justify-center rounded-lg`}
                >
                  {isUri(c?.company_logo) ? (
                    <Image
                      src={c?.company_logo}
                      width={16}
                      height={16}
                      alt={`${c?.company_name} logo`}
                      className="overflow-hidden object-cover"
                    />
                  ) : (
                    <Command className="size-4" />
                  )}
                  <div className="flex-1">
                    <p className="truncate">{c.company_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.company_register}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
