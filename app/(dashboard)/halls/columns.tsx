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

import { deleteHalls } from './actions';
import { UpdateDialog } from './components';
import { HallsItemType } from './schema';

const Action = ({ row }: CellContext<HallsItemType, unknown>) => {
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
          deleteHalls(row.original.id)
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
            <b className="text-foreground">{row.original.halls_name}</b>?
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

export const hallsColumns: ColumnDef<HallsItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    id: 'venue_id',
    accessorKey: 'venue_id',
    header: 'Venue id',
  },
  {
    id: 'branch_id',
    accessorKey: 'branch_id',
    header: 'Branch id',
  },
  {
    id: 'hall_name',
    accessorKey: 'hall_name',
    header: 'Hall name',
  },
  {
    id: 'hall_desc',
    accessorKey: 'hall_desc',
    header: 'Hall desc',
  },
  {
    id: 'capacity',
    accessorKey: 'capacity',
    header: 'Capacity',
  },
  {
    id: 'hall_image',
    accessorKey: 'hall_image',
    header: 'Hall image',
  },
  {
    id: 'hall_location',
    accessorKey: 'hall_location',
    header: 'Hall location',
  },
  {
    id: 'hall_order',
    accessorKey: 'hall_order',
    header: 'Hall order',
  },
  {
    id: 'hall_type',
    accessorKey: 'hall_type',
    header: 'Hall type',
  },
  {
    id: 'amenities',
    accessorKey: 'amenities',
    header: 'Amenities',
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
