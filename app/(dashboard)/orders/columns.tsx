'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { Button } from '@/components/ui/button';

import { deleteOrder } from './actions';
import { UpdateDialog } from './components';
import { OrderItemType } from './schema';

const Action = ({ row }: CellContext<OrderItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);

  return (
    <div className="me-2 flex justify-end gap-4">
      <UpdateDialog
        initialData={row.original}
        key={JSON.stringify(row.original)}
      >
        <Button size={'cxs'} variant="outline">
          <Edit className="h-4 w-4" /> Edit
        </Button>
      </UpdateDialog>

      <DeleteDialog
        ref={deleteDialogRef}
        loading={loading}
        action={() => {
          setLoading(true);
          deleteOrder(row.original.id)
            .then((c) => toast.success(c.data.message))
            .catch((c) => toast.error(c.message))
            .finally(() => {
              deleteDialogRef.current?.close();
              setLoading(false);
            });
        }}
        description={
          <>
            Are you sure you want to delete this{' '}
            <b className="text-foreground">{row.original.order_name}</b>?
          </>
        }
      >
        <Button size={'cxs'}>
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </DeleteDialog>
    </div>
  );
};

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
  {
    id: 'actions',
    cell: Action,
  },
];
