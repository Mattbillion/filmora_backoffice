'use client';

import { currencyFormat } from '@interpriz/lib';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Image from 'next/image';

import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { Badge } from '@/components/ui/badge';

import { SchedulesItemType } from './schema';

type ScheduleColumnType = SchedulesItemType & {
  templatePreview?: string;
  templateName?: string;
  venue?: string;
  branch?: string;
  hall?: string;
};

export const schedulesColumns: ColumnDef<
  ScheduleColumnType & { venue?: string; branch?: string; hall?: string }
>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.original.id,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'template_id',
    accessorKey: 'template_id',
    header: 'Template',
    cell: ({ row }) => (
      <div className="flex min-w-40 flex-wrap items-center gap-2">
        {!!row.original.templatePreview && (
          <Image
            src={row.original.templatePreview}
            width={150}
            height={150}
            alt="Stage preview"
            className="aspect-square overflow-hidden rounded-md bg-slate-50 object-cover"
          />
        )}
        <span>{row.original.templateName}</span>
      </div>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Суурь үнэ',
    cell: ({ row }) => currencyFormat(row.original.price),
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    id: 'date',
    accessorKey: 'date',
    header: 'Эхлэх огноо',
    cell: ({ row }) =>
      row.original.date ? (
        <Badge variant="secondary" className="text-nowrap">
          {dayjs(row.original.date).format('YYYY-MM-DD hh:mm')}
        </Badge>
      ) : (
        'N/A'
      ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'start_at',
    accessorKey: 'start_at',
    header: 'Эхлэх цаг',
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-nowrap">
        {row.original.start_at.split('.')[0]}
      </Badge>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'end_at',
    accessorKey: 'end_at',
    header: 'Дуусах цаг',
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-nowrap">
        {row.original.end_at.split('.')[0]}
      </Badge>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'hall_id',
    accessorKey: 'hall_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.hall,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'venue_id',
    accessorKey: 'venue_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.venue,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'branch_id',
    accessorKey: 'branch_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.branch,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Badge variant={row.original.status ? 'outline' : 'destructive'}>
        {row.original.status ? 'Active' : 'Inactive'}
      </Badge>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-nowrap">
        {row.original.created_at
          ? dayjs(row.original.created_at).format('YYYY-MM-DD hh:mm')
          : undefined}
      </Badge>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'updated_at',
    accessorKey: 'updated_at',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-nowrap">
        {row.original.updated_at
          ? dayjs(row.original.updated_at).format('YYYY-MM-DD hh:mm')
          : undefined}
      </Badge>
    ),
  },
];
