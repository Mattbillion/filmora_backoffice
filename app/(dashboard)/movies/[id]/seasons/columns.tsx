'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { isUri, removeHTML } from '@/lib/utils';
import { SeriesSeasonType } from '@/services/schema';

export const seasonsColumns: ColumnDef<SeriesSeasonType>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.id,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'season_number',
    accessorKey: 'season_number',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.season_number,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.title?.slice(0, 300),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <span className="opacity-70">
        {removeHTML(row.original.description?.slice(0, 300))}
      </span>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'release_date',
    accessorKey: 'release_date',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.release_date,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'cover_image_url',
    accessorKey: 'cover_image_url',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) =>
      isUri(row.original.cover_image_url) ? (
        <Image
          src={row.original.cover_image_url!}
          alt=""
          width={48}
          height={48}
          className="rounded-md"
        />
      ) : (
        <span className="size-12 rounded-md text-xs opacity-70">No Image</span>
      ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.created_at,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'updated_at',
    accessorKey: 'updated_at',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.updated_at,
    enableSorting: true,
    enableColumnFilter: true,
  },
];
