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
import { checkPermission } from '@/lib/permission';
import { removeHTML } from '@/lib/utils';

import { deleteCategoryAttributesDetail } from './actions';
import { UpdateDialog } from './components';
import { CategoryAttributesItemType } from './schema';

const Action = ({ row }: CellContext<CategoryAttributesItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, ['delete_category_attribute']);
  const canEdit = checkPermission(data, ['update_category_attribute']);

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
                deleteCategoryAttributesDetail(row.original.id)
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
                  <b className="text-foreground">{row.original.attr_name}</b>?
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

export const categoryAttributesColumns: ColumnDef<CategoryAttributesItemType>[] =
  [
    {
      accessorKey: 'id',
      header: ({ column }) => <TableHeaderWrapper column={column} />,
    },
    {
      id: 'attr_name',
      accessorKey: 'attr_name',
      header: ({ column }) => <TableHeaderWrapper column={column} />,
      cell: ({ row }) => row.original.attr_name?.slice(0, 300),
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: 'attr_desc',
      accessorKey: 'attr_desc',
      header: ({ column }) => <TableHeaderWrapper column={column} />,
      cell: ({ row }) => (
        <p>
          html:{' '}
          <span className="opacity-70">
            {removeHTML(row.original.attr_desc?.slice(0, 300))}
          </span>
        </p>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      id: 'attr_type',
      accessorKey: 'attr_type',
      header: ({ column }) => <TableHeaderWrapper column={column} />,
      cell: ({ row }) => row.original.attr_type?.slice(0, 300),
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: 'display_order',
      accessorKey: 'display_order',
      header: ({ column }) => <TableHeaderWrapper column={column} />,
      cell: ({ row }) => row.original.display_order,
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => <TableHeaderWrapper column={column} />,
      cell: ({ row }) => (row.original.status ? 'Active' : 'Inactive'),
      enableSorting: false,
      enableColumnFilter: true,
    },
    {
      id: 'actions',
      cell: Action,
    },
  ];
