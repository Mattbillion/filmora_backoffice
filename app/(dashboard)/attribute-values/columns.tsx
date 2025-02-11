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

import { deleteAttributeValue } from './actions';
import { UpdateDialog } from './components';
import { AttributeValueItemType } from './schema';

const Action = ({ row }: CellContext<AttributeValueItemType, unknown>) => {
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
          deleteAttributeValue(row.original.id)
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
            <b className="text-foreground">
              {row.original.attribute_value_name}
            </b>
            ?
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

export const attributeValueColumns: ColumnDef<AttributeValueItemType>[] = [
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
    id: 'cat_id',
    accessorKey: 'cat_id',
    header: 'Cat id',
  },
  {
    id: 'attr_id',
    accessorKey: 'attr_id',
    header: 'Attr id',
  },
  {
    id: 'value',
    accessorKey: 'value',
    header: 'Value',
  },
  {
    id: 'display_order',
    accessorKey: 'display_order',
    header: 'Display order',
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
