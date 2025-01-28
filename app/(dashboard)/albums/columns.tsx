'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Edit, ListMusic,Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currencyFormat } from '@/lib/utils';

import { deleteAlbum } from './actions';
import { UpdateDialog } from './components';
import { AlbumItemType } from './schema';

const Action = ({ row }: CellContext<AlbumItemType, unknown>) => {
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
        permissionSubject="albums"
        loading={loading}
        action={() => {
          setLoading(true);
          deleteAlbum(row.original.id)
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

const ChildDatas = ({ row }: CellContext<AlbumItemType, unknown>) => {
  const router = useRouter();

  return (
    <div className="me-2 flex justify-end gap-4">
      <Button
        size={'cxs'}
        variant="outline"
        type="button"
        onClick={() =>
          router.push(`/albums/lectures?albumId=${row.original.id}`)
        }
      >
        <ListMusic className="h-4 w-4" /> Lectures
      </Button>
    </div>
  );
};

export const albumColumns: ColumnDef<AlbumItemType>[] = [
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
    cell: ({ row }) => {
      const tags = row.original.tags || [];
      return (
        <>
          {tags
            .slice(0, 3)
            .map((e) => e.name)
            .join(', ')}
          {tags.length > 3 && (
            <Badge variant="secondary" className="ml-2">
              +{tags.length - 3}
            </Badge>
          )}
        </>
      );
    },
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) =>
      ({ 2: 'Hidden', 1: 'Active', 0: 'Inactive' })[row.original.status] ??
      'Unknown',
  },
  {
    id: 'lecture-list',
    cell: ChildDatas,
  },
  {
    id: 'actions',
    cell: Action,
  },
];
