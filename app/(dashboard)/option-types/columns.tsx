'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteOptionTypes } from '@/features/option-types/actions';
import { OptionTypesItemType } from '@/features/option-types/schema';
import { checkPermission } from '@/lib/permission';

import { UpdateDialog } from './components';

const Action = ({ row }: CellContext<OptionTypesItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, [
    'delete_company_merchandise_attribute_option_value',
  ]);
  const canEdit = checkPermission(data, [
    'update_company_merchandise_attribute_option_value',
  ]);

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
                deleteOptionTypes(row.original.id)
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
                  <b className="text-foreground">{row.original.option_name}</b>?
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

export const optionTypesColumns: ColumnDef<OptionTypesItemType>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'option_name',
    accessorKey: 'option_name',
    header: ({ column }) => <TableHeaderWrapper column={column} />,

    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    id: 'option_name_mn',
    accessorKey: 'option_name_mn',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    id: 'option_desc',
    accessorKey: 'option_desc',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Badge variant={row.original.status ? 'outline' : 'destructive'}>
        {row.original.status ? 'Active' : 'Inactive'}
      </Badge>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.created_at
          ? dayjs(row.original.created_at).format('YYYY-MM-DD hh:mm')
          : undefined}
      </Badge>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'updated_at',
    accessorKey: 'updated_at',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.updated_at
          ? dayjs(row.original.updated_at).format('YYYY-MM-DD hh:mm')
          : undefined}
      </Badge>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'actions',
    cell: Action,
  },
];
