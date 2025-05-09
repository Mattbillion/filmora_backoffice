'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';

import { TransactionsItemType } from './schema';

export const transactionsColumns: ColumnDef<TransactionsItemType>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Link href={`/transactions/${row.original.id}`}>{row.original.id}</Link>
    ),
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    id: 'order_id',
    accessorKey: 'order_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Link href={`/orders/${row.original.order_id}`}>
        {row.original.order_id}
      </Link>
    ),
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
    cell: ({ row }) => row.original.transaction_status,
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
