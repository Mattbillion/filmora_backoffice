'use client';
import { ChevronsUpDown, LogOut, Moon, Settings, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { imageResize } from '@/lib/utils';

export function NavUser({ session }: { session: Session }) {
  const { isMobile } = useSidebar();
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={imageResize(session?.user?.profile ?? '', 'small')}
                  alt={session?.user?.lastname ?? ''}
                />
                <AvatarFallback className="rounded-lg">
                  {(
                    (session?.user?.email ||
                      (session.user.firstname || '')[0]?.concat(
                        (session.user.lastname || '')[0],
                      )) ??
                    ''
                  )?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {[session?.user?.firstname, session?.user?.lastname].join(
                    ' ',
                  )}
                </span>
                <span className="truncate text-xs">
                  {session?.user?.email ?? ''}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={session?.user?.profile ?? ''}
                    alt={session?.user?.name ?? ''}
                  />
                  <AvatarFallback className="rounded-lg">
                    {(
                      (session?.user?.email ||
                        (session.user.firstname || '')[0]?.concat(
                          (session.user.lastname || '')[0],
                        )) ??
                      ''
                    )?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {session.user.firstname.concat(
                      ' ',
                      session.user.lastname,
                    ) ?? ''}
                  </span>
                  <span className="truncate">{session?.user?.email ?? ''}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push('/')}
              >
                <Settings />
                Систем тохиргоо
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                }}
              >
                {theme === 'dark' ? <Moon /> : <Sun />}
                {` ${theme === 'light' ? 'Dark' : 'Light'} mode`}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut({ redirectTo: '/login' })}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
