'use client';

import { useRef, useState } from 'react';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteRoleByPermission } from '@/features/permission/actions';
import {
  PermissionByRoleItemType,
  PermissionItemType,
} from '@/features/permission/schema';
import { checkPermission } from '@/lib/permission';

const Action = ({ row }: CellContext<PermissionByRoleItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, ['delete_role_permission']);

  if (!canDelete) return null;
  return (
    <div className="me-2 flex justify-end gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DeleteDialog
            ref={deleteDialogRef}
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
                  {
                    (row.original as unknown as PermissionItemType)
                      .permission_name
                  }
                </b>
                ?
              </>
            }
          >
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Trash className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DeleteDialog>
        </DropdownMenuContent>
      </DropdownMenu>
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
