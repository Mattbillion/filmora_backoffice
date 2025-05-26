'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';

import { TransactionsItemType } from './schema';

export const transactionsColumns: ColumnDef<TransactionsItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <Link href={`/transactions/${row.original.id}`}>{row.original.id}</Link>
    ),
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    id: 'order_id',
    accessorKey: 'order_id',
    header: 'Order ID',
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
    header: 'Шилжүүлгийн дүн',
    cell: ({ row }) => row.original.transaction_amount,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'transaction_status',
    accessorKey: 'transaction_status',
    header: 'Шилжүүлгийн төлөв',
    cell: ({ row }) => {
      const status = row.original.transaction_status;

      const statusTextMap: Record<string, string> = {
        completed: 'Амжилттай',
        cancelled: 'Цуцлагдсан',
        pending: 'Хүлээгдэж буй',
      };

      let badgeVariant: 'default' | 'destructive' | 'outline' | 'secondary' =
        'default';

      switch (status) {
        case 'completed':
          badgeVariant = 'default';
          break;
        case 'cancelled':
          badgeVariant = 'destructive';
          break;
        default:
          badgeVariant = 'outline';
      }

      return (
        <Badge variant={badgeVariant}> {statusTextMap[status] ?? status}</Badge>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'payment_method',
    accessorKey: 'payment_method',
    header: 'Төлбөрийн төрөл',
    cell: ({ row }) => row.original.payment_method,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'transaction_date',
    accessorKey: 'transaction_date',
    header: 'Шүлжүүлгийн огноо',
    cell: ({ row }) => row.original.transaction_date,
    enableSorting: true,
    enableColumnFilter: true,
  },
];
