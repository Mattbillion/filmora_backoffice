'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currencyFormat } from '@/lib/utils';

import { deleteLecture } from './actions';
import { UpdateDialog } from './components';
import { LectureItemType } from './schema';

const Action = ({ row }: CellContext<LectureItemType, unknown>) => {
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
        permissionSubject="albums.lectures"
        loading={loading}
        action={() => {
          setLoading(true);
          deleteLecture(row.original.id)
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
            <b className="text-foreground">{row.original.title}</b>?
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

export const lectureColumns: ColumnDef<LectureItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => currencyFormat(row.original.price ?? 0),
  },
  {
    id: 'order',
    header: 'Order',
    cell: ({ row }) => row.original.order,
  },
  {
    id: 'tags',
    header: () => 'Tag',
    cell: ({ row }) => (
      <>
        {row.original.tags
          .slice(0, 3)
          .map((e) => e.name)
          .join(', ')}
        {row.original.tags.length > 3 && (
          <Badge variant="secondary" className="ml-2">
            +{row.original.tags.length - 3}
          </Badge>
        )}
      </>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) =>
      ({ 2: 'Hidden', 1: 'Active', 0: 'Inactive' })[row.original.status] ??
      'Unknown',
  },
  {
    id: 'actions',
    cell: Action,
  },
];
