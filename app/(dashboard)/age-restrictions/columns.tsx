'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { Button } from '@/components/ui/button';
import { checkPermission } from '@/lib/permission';
import { removeHTML } from '@/lib/utils';

import { deleteAgeRestrictions } from './actions';
import { UpdateDialog } from './components';
import { AgeRestrictionsItemType } from './schema';

const Action = ({ row }: CellContext<AgeRestrictionsItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data: session } = useSession();

  console.log(session);
  return (
    <div className="me-2 flex justify-end gap-4">
      {checkPermission(session, ['update_age_restriction']) && (
        <UpdateDialog
          initialData={row.original}
          key={JSON.stringify(row.original)}
        >
          <Button size={'cxs'} variant="outline">
            <Edit className="h-4 w-4" /> Edit
          </Button>
        </UpdateDialog>
      )}

      <DeleteDialog
        ref={deleteDialogRef}
        loading={loading}
        permissions={['delete_age_restriction']}
        action={() => {
          setLoading(true);
          deleteAgeRestrictions(row.original.id)
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
            <b className="text-foreground">{row.original.age_name}</b>?
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

export const ageRestrictionsColumns: ColumnDef<AgeRestrictionsItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    id: 'age_name',
    header: 'Age name',
    cell: ({ row }) => row.original.age_name?.slice(0, 300),
  },
  {
    id: 'age_limit',
    header: 'Age limit',
    cell: ({ row }) => row.original.age_limit?.slice(0, 300),
  },
  {
    id: 'age_desc',
    header: 'Age desc',
    cell: ({ row }) => (
      <p>
        html:{' '}
        <span className="opacity-70">
          {removeHTML(row.original.age_desc?.slice(0, 300))}
        </span>
      </p>
    ),
  },
  {
    id: 'age_order',
    header: 'Age order',
    cell: ({ row }) => row.original.age_order,
  },
  {
    id: 'min_age',
    header: 'Min age',
    cell: ({ row }) => row.original.min_age,
  },
  {
    id: 'max_age',
    header: 'Max age',
    cell: ({ row }) => row.original.max_age,
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => (row.original.status ? 'Active' : 'Inactive'),
  },
  {
    id: 'actions',
    cell: Action,
  },
];
