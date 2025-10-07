'use client';

import { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Edit, MoreHorizontal } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { checkPermission } from '@/lib/permission';
import { EmployeeResponseType } from '@/services/schema';

import { UpdateDialog } from './components';

const Action = ({ row }: CellContext<EmployeeResponseType, unknown>) => {
  const { data } = useSession();
  const canEdit = checkPermission(data, []);

  if (!canEdit || row.original.full_name === 'filmora') return null;

  return (
    <div className="me-2 flex justify-end gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {canEdit && (
            <UpdateDialog initialData={row.original} key={row.id}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="h-4 w-4" /> Edit
              </DropdownMenuItem>
            </UpdateDialog>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const employeesColumns: ColumnDef<EmployeeResponseType>[] = [
  {
    id: 'full_name',
    accessorKey: 'full_name',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.full_name ?? '-',
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.email,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.role}
      </Badge>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'is_active',
    accessorKey: 'is_active',
    header: ({ column }) => (
      <TableHeaderWrapper column={column} label="Active" />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
        {row.original.is_active ? 'Active' : 'Inactive'}
      </Badge>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'last_logged_at',
    accessorKey: 'last_logged_at',
    header: ({ column }) => (
      <TableHeaderWrapper column={column} label="Last login" />
    ),
    cell: ({ row }) =>
      dayjs(row.original.last_logged_at).format('YYYY-MM-DD HH:mm'),
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => (
      <TableHeaderWrapper column={column} label="Created" />
    ),
    cell: ({ row }) =>
      dayjs(row.original.created_at).format('YYYY-MM-DD HH:mm'),
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    id: 'actions',
    cell: Action,
    enableHiding: false,
  },
];
