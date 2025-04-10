'use client';

import { ColumnDef } from '@tanstack/react-table';

import { OrderItemType } from './schema';

export const orderColumns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    id: 'order_number',
    accessorKey: 'order_number',
    header: 'Order number',
  },
  {
    id: 'total_price',
    accessorKey: 'total_price',
    header: 'Total price',
  },
  {
    id: 'order_status',
    accessorKey: 'order_status',
    header: 'Order status',
  },
  {
    id: 'payment_method',
    accessorKey: 'payment_method',
    header: 'Payment method',
  },
  {
    id: 'payment_deadline',
    accessorKey: 'payment_deadline',
    header: 'Payment deadline',
  },
  {
    id: 'purchase_at',
    accessorKey: 'purchase_at',
    header: 'Purchase at',
  },
  {
    id: 'order_date',
    accessorKey: 'order_date',
    header: 'Order date',
  },
  {
    id: 'order_time',
    accessorKey: 'order_time',
    header: 'Order time',
  },
  {
    id: 'user_id',
    accessorKey: 'user_id',
    header: 'User id',
  },
];
