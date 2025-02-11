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

import { deleteVenues } from './actions';
import { UpdateDialog } from './components';
import { VenuesItemType } from './schema';

const Action = ({ row }: CellContext<VenuesItemType, unknown>) => {
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
          deleteVenues(row.original.id)
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
            <b className="text-foreground">{row.original.venue_name}</b>?
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

export const venuesColumns: ColumnDef<VenuesItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    id: 'venue_name',
    accessorKey: 'venue_name',
    header: 'Venue name',
  },
  {
    id: 'venue_desc',
    accessorKey: 'venue_desc',
    header: 'Venue desc',
  },
  {
    id: 'venue_logo',
    accessorKey: 'venue_logo',
    header: 'Venue logo',
  },
  {
    id: 'venue_email',
    accessorKey: 'venue_email',
    header: 'Venue email',
  },
  {
    id: 'venue_phone',
    accessorKey: 'venue_phone',
    header: 'Venue phone',
  },
  {
    id: 'venue_location',
    accessorKey: 'venue_location',
    header: 'Venue location',
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
