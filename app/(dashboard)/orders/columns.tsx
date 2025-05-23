'use client';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Link from 'next/link';

import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';

import { OrdersItemType } from './schema';

export const ordersColumns: ColumnDef<
  OrdersItemType & {
    canModify?: boolean;
  }
>[] = [
  {
    id: 'order_id',
    accessorKey: 'order_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) =>
      row.original.canModify ? (
        <Link href={`/orders/${row.original.order_id}`}>
          {row.original.order_id}
        </Link>
      ) : (
        row.original.order_id
      ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'order_number',
    accessorKey: 'order_number',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.order_number?.slice(0, 300),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'order_status',
    accessorKey: 'order_status',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.order_status?.slice(0, 300),
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    id: 'payment_deadline',
    accessorKey: 'payment_deadline',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) =>
      row.original.payment_deadline
        ? dayjs(row.original.payment_deadline).format('YYYY/MM/DD hh:mm:ss')
        : undefined,

    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'order_date',
    accessorKey: 'order_date',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) =>
      row.original.order_date
        ? dayjs(row.original.order_date).format('YYYY/MM/DD hh:mm:ss')
        : undefined,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'order_time',
    accessorKey: 'order_time',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.order_time,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'product_count',
    accessorKey: 'product_count',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.product_count,
    enableSorting: true,
    enableColumnFilter: true,
  },
];
