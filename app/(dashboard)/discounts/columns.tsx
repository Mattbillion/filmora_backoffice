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

import { deleteDiscount } from './actions';
import { UpdateDialog } from './components';
import { DiscountItemType } from './schema';

const Action = ({ row }: CellContext<DiscountItemType, unknown>) => {
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
          deleteDiscount(row.original.id)
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
            <b className="text-foreground">{row.original.discount_name}</b>?
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

export const discountColumns: ColumnDef<DiscountItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    id: 'com_id',
    accessorKey: 'com_id',
    header: 'Com id',
  },
  {
    id: 'discount_name',
    accessorKey: 'discount_name',
    header: 'Discount name',
  },
  {
    id: 'discount_desc',
    accessorKey: 'discount_desc',
    header: 'Discount desc',
  },
  {
    id: 'discount_type',
    accessorKey: 'discount_type',
    header: 'Discount type',
  },
  {
    id: 'discount',
    accessorKey: 'discount',
    header: 'Discount',
  },
  {
    id: 'start_at',
    accessorKey: 'start_at',
    header: 'Start at',
  },
  {
    id: 'end_at',
    accessorKey: 'end_at',
    header: 'End at',
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'actions',
    cell: Action,
  },
];
