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

import { deleteCategory } from './actions';
import { UpdateDialog } from './components';
import { CategoryItemType } from './schema';

const Action = ({ row }: CellContext<CategoryItemType, unknown>) => {
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
          deleteCategory(row.original.id)
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
            <b className="text-foreground">{row.original.cat_name}</b>?
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

export const categoryColumns: ColumnDef<CategoryItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    id: 'cat_type',
    accessorKey: 'cat_type',
    header: 'Cat type',
  },
  {
    id: 'cat_name',
    accessorKey: 'cat_name',
    header: 'Cat name',
  },
  {
    id: 'root',
    accessorKey: 'root',
    header: 'Root',
  },
  {
    id: 'order',
    accessorKey: 'order',
    header: 'Order',
  },
  {
    id: 'special',
    accessorKey: 'special',
    header: 'Special',
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Description',
  },
  {
    id: 'image',
    accessorKey: 'image',
    header: 'Image',
  },
  {
    id: 'ancestors',
    accessorKey: 'ancestors',
    header: 'Ancestors',
  },
  {
    id: 'actions',
    cell: Action,
  },
];
