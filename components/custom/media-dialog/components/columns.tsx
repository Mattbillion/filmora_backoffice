'use client';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Image from 'next/image';

import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { Checkbox } from '@/components/ui/checkbox';

import { MediaItemType } from './schema';

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
];
