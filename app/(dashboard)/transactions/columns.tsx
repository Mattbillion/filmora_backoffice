'use client';

import { ColumnDef } from '@tanstack/react-table';

import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';

import { TransactionsItemType } from './schema';

export const transactionsColumns: ColumnDef<TransactionsItemType>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
  },
  {
    id: 'order_id',
    accessorKey: 'order_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.order_id,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'user_id',
    accessorKey: 'user_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.user_id?.slice(0, 300),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'transaction_amount',
    accessorKey: 'transaction_amount',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.transaction_amount,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'transaction_status',
    accessorKey: 'transaction_status',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.transaction_status?.slice(0, 300),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'payment_method',
    accessorKey: 'payment_method',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.payment_method,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'transaction_date',
    accessorKey: 'transaction_date',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.transaction_date,
    enableSorting: true,
    enableColumnFilter: true,
  },
];
