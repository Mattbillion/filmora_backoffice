'use client';
import { ChevronsUpDown, LogOut, Moon, Settings, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';

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

export function NavUser({ session }: { session: Session }) {
  const { isMobile } = useSidebar();
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  console.log(session.user);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <div className="bg-sidebar-accent size-8 basis-8 rounded-lg">
                {(
                  session?.user?.email ||
                  session.user?.full_name ||
                  session.user?.role ||
                  ''
                )?.slice(0, 2)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {session?.user?.full_name}
                </span>
                <span className="truncate text-xs">
                  {session?.user?.email ?? ''}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="h-8 w-8 rounded-lg">
                  {(
                    (session?.user?.email || session.user?.full_name) ??
                    ''
                  )?.slice(0, 2)}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {session.user?.full_name}
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
