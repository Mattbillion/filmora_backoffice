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

import { deleteBranch } from './actions';
import { UpdateDialog } from './components';
import { BranchItemType } from './schema';

const Action = ({ row }: CellContext<BranchItemType, unknown>) => {
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
          deleteBranch(row.original.id)
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
            <b className="text-foreground">{row.original.branch_name}</b>?
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

export const branchColumns: ColumnDef<BranchItemType>[] = [
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
    id: 'branch_name',
    accessorKey: 'branch_name',
    header: 'Branch name',
  },
  {
    id: 'branch_desc',
    accessorKey: 'branch_desc',
    header: 'Branch desc',
  },
  {
    id: 'branch_logo',
    accessorKey: 'branch_logo',
    header: 'Branch logo',
  },
  {
    id: 'branch_phone',
    accessorKey: 'branch_phone',
    header: 'Branch phone',
  },
  {
    id: 'branch_location',
    accessorKey: 'branch_location',
    header: 'Branch location',
  },
  {
    id: 'branch_long',
    accessorKey: 'branch_long',
    header: 'Branch long',
  },
  {
    id: 'branch_lat',
    accessorKey: 'branch_lat',
    header: 'Branch lat',
  },
  {
    id: 'branch_email',
    accessorKey: 'branch_email',
    header: 'Branch email',
  },
  {
    id: 'branch_order',
    accessorKey: 'branch_order',
    header: 'Branch order',
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'branch_schedule',
    accessorKey: 'branch_schedule',
    header: 'Branch schedule',
  },
  {
    id: 'branch_images',
    accessorKey: 'branch_images',
    header: 'Branch images',
  },
  {
    id: 'actions',
    cell: Action,
  },
];
