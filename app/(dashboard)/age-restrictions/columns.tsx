'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteAgeRestrictionsDetail } from '@/features/age/actions';
import { AgeRestrictionsItemType } from '@/features/age/schema';
import { checkPermission } from '@/lib/permission';
import { removeHTML } from '@/lib/utils';

import { UpdateDialog } from './components';

const Action = ({ row }: CellContext<AgeRestrictionsItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, ['delete_age_restriction']);
  const canEdit = checkPermission(data, ['update_age_restriction']);

  if (!canEdit && !canDelete) return null;

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
          {canEdit && (
            <UpdateDialog
              initialData={row.original}
              key={JSON.stringify(row.original)}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="h-4 w-4" /> Edit
              </DropdownMenuItem>
            </UpdateDialog>
          )}
          {canDelete && (
            <DeleteDialog
              ref={deleteDialogRef}
              loading={loading}
              action={() => {
                setLoading(true);
                // TODO: Please check after generate
                deleteAgeRestrictionsDetail(row.original.id)
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
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DeleteDialog>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const ageRestrictionsColumns: ColumnDef<AgeRestrictionsItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    id: 'age_name',
    accessorKey: 'age_name',
    header: 'Age name',
    cell: ({ row }) => (
      <p className="w-full max-w-[180px] truncate text-nowrap">
        {row.original.age_name}
      </p>
    ),
  },
  {
    id: 'age_limit',
    accessorKey: 'age_limit',
    header: 'Насны хязгаар',
    cell: ({ row }) => row.original.age_limit?.slice(0, 300),
  },
  {
    id: 'age_desc',
    accessorKey: 'age_desc',
    header: 'Дэлгэрэнгүй',
    cell: ({ row }) => (
      <p>
        html:{' '}
        <span className="opacity-70">
          {removeHTML(row.original.age_desc?.slice(0, 300))}
        </span>
      </p>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'age_order',
    accessorKey: 'age_order',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.age_order,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'min_age',
    accessorKey: 'min_age',
    header: 'Min age',
    cell: ({ row }) => row.original.min_age,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'max_age',
    accessorKey: 'max_age',
    header: 'Max age',
    cell: ({ row }) => row.original.max_age,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Төлөв',
    cell: ({ row }) => (row.original.status ? 'Active' : 'Inactive'),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: Action,
  },
];
