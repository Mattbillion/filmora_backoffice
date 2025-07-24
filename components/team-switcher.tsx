'use client';

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { Check, ChevronsUpDown, Command as CommandIcon } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { getCompanyList } from '@/features/companies/actions';
import { CompanyItemType } from '@/features/companies/schema';
import { cn, isUri } from '@/lib/utils';

export function TeamSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState<CompanyItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, update: updateSession } = useSession();

  useEffect(() => {
    if (!companies?.length) {
      setLoading(true);
      getCompanyList()
        .then((c) => {
          const companyList = c.data.data || [];
          if (!(session?.user || {}).company_id)
            updateSession({
              ...session,
              user: {
                ...(session?.user || {}),
                company_id: companyList[0]?.id,
                company_name: companyList[0]?.company_name,
                company_register: companyList[0]?.company_register,
                company_logo: companyList[0]?.company_logo,
              },
            }).finally(() => setCompanies(companyList));
          else setCompanies(companyList);
        })
        .finally(() => setLoading(false));
    }
  }, [pathname, session?.user?.company_id]);

  const debouncedSearch = debounce((val) => {
    setLoading(true);
    getCompanyList(val ? { filters: `company_name=${val}` } : undefined)
      .then((c) => setCompanies(c.data.data || []))
      .finally(() => setLoading(false));
  }, 200);

  if (!session?.user) return null;

  if (loading)
    return (
      <div className="flex animate-pulse items-center gap-2 rounded-lg border border-border p-2">
        <div className="size flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-200" />
        <div className="flex-1 text-left text-sm leading-tight">
          <div className="w-3/3 mb-1 h-3 rounded-sm bg-slate-200" />
          <div className="h-3 w-2/3 rounded-sm bg-slate-200" />
        </div>
      </div>
    );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground group-data-[state=collapsed]:overflow-hidden group-data-[state=collapsed]:px-0">
              <div className="relative flex aspect-square size-8 shrink-0 grow-0 basis-8 items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary text-sidebar-primary-foreground group-data-[state=collapsed]:size-7 group-data-[state=collapsed]:basis-7">
                {isUri(session?.user?.company_logo || '') ? (
                  <Image
                    src={session?.user?.company_logo!}
                    fill
                    alt={`${session?.user?.company_name} logo`}
                    className="object-cover"
                  />
                ) : (
                  <CommandIcon className="size-4" />
                )}
              </div>
              <div className="flex-1 text-left text-sm leading-tight">
                <p className="truncate font-semibold">
                  {session?.user?.company_name || 'XOOX'}
                </p>
                {session?.user?.company_register && (
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.company_register}
                  </p>
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search by name"
                onValueChange={(value) => debouncedSearch(value)}
              />
              <CommandList>
                <CommandEmpty>No companies found</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-y-auto">
                  {companies?.map((c, idx) => (
                    <CommandItem
                      key={idx}
                      value={`${c.id}`}
                      disabled={loading && !!companies.length}
                      onSelect={() =>
                        updateSession({
                          ...session,
                          user: {
                            ...session.user,
                            company_id: c.id,
                            company_name: c.company_name,
                            company_register: c.company_register,
                            company_logo: c.company_logo,
                          },
                        }).finally(() => {
                          window.location.reload();
                          setOpen(false);
                        })
                      }
                      className="gap-3"
                    >
                      <div className="flex aspect-square size-6 items-center justify-center rounded-lg bg-accent">
                        {isUri(c?.company_logo) ? (
                          <div className="relative aspect-square size-8 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={c?.company_logo}
                              fill
                              alt={`${c?.company_name} logo`}
                              className="overflow-hidden object-cover"
                            />
                          </div>
                        ) : (
                          <Command className="size-3.5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="truncate">{c.company_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.company_register}
                        </p>
                      </div>
                      <Check
                        className={cn(
                          'ml-2 h-4 w-4',
                          session.user.company_id === c.id
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
