'use client';

import { CellContext, ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { MediaItemType } from './schema';
import { Checkbox } from '@/components/ui/checkbox';
import dayjs from 'dayjs';

const Action = ({ row }: CellContext<MediaItemType, unknown>) => {
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const mediaColumns: ColumnDef<MediaItemType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: 'image_url',
    accessorKey: 'image_url',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <div className="relative aspect-square size-12">
        <Image
          src={row.original.image_url}
          alt={row.original.file_name}
          fill
          className="rounded-md object-cover"
        />
      </div>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },

  {
    id: 'file_name',
    accessorKey: 'file_name',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.file_name,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'file_size',
    accessorKey: 'file_size',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.file_size,
    enableSorting: false,
    enableColumnFilter: false,
  },

  {
    id: 'content_type',
    accessorKey: 'content_type',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.content_type,
    enableSorting: false,
    enableColumnFilter: false,
  },

  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => dayjs(row.original.created_at).format('DD/MM/YYYY'),
    enableSorting: false,
    enableColumnFilter: false,
  },

  {
    id: 'actions',
    cell: Action,
  },
];
