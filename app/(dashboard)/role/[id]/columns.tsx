'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { Button } from '@/components/ui/button';
import { deleteRoleByPermission } from '@/features/permission/actions';
import {
  PermissionByRoleItemType,
  PermissionItemType,
} from '@/features/permission/schema';

const Action = ({ row }: CellContext<PermissionByRoleItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);

  return (
    <div className="me-2 flex justify-end gap-4">
      <DeleteDialog
        ref={deleteDialogRef}
        permissions={['delete_role_permission']}
        loading={loading}
        action={() => {
          setLoading(true);
          deleteRoleByPermission(row.original.id)
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
              {(row.original as unknown as PermissionItemType).permission_name}
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

export const permissionColumns: ColumnDef<PermissionByRoleItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    id: 'permission_name',
    header: 'Name',
    accessorKey: 'permission_name',
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
