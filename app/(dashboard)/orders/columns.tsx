'use client';

import { ColumnDef } from '@tanstack/react-table';

import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';

import { OrdersItemType } from './schema';

export const ordersColumns: ColumnDef<OrdersItemType>[] = [
  {
    id: 'order_id',
    accessorKey: 'order_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.order_id,
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
    enableColumnFilter: true,
  },
  {
    id: 'payment_deadline',
    accessorKey: 'payment_deadline',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.payment_deadline?.slice(0, 300),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'order_date',
    accessorKey: 'order_date',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.order_date?.slice(0, 300),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'order_time',
    accessorKey: 'order_time',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.order_time?.slice(0, 300),
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
