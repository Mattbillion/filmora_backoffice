'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Edit, ListTree, MoreHorizontal, Trash } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteCategoryDetail } from '@/features/category/actions';
import { CategoryItemType } from '@/features/category/schema';
import { checkPermission } from '@/lib/permission';
import { cn, removeHTML } from '@/lib/utils';

import { UpdateDialog } from './components';

const Action = ({ row }: CellContext<CategoryItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, ['delete_category']);
  const canEdit = checkPermission(data, ['update_category']);

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
                deleteCategoryDetail(row.original.id)
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
                  <b className="text-foreground">{row.original.cat_name}</b>?
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

const Navigation = ({ row }: CellContext<CategoryItemType, unknown>) => {
  const { data } = useSession();

  if (
    !checkPermission(data, [
      'get_category_attribute_list',
      'get_category_attribute',
      'create_category_attribute',
      'update_category_attribute',
      'delete_category_attribute',
    ])
  )
    return null;
  return (
    <Link
      href={`/categories/${row.original.id}/attributes`}
      className={cn(buttonVariants({ variant: 'outline', size: 'cxs' }))}
    >
      <ListTree className="h-4 w-4" /> Attributes
    </Link>
  );
};

export const categoryColumns: ColumnDef<
  CategoryItemType & { rootName?: string }
>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
  },
  {
    id: 'cat_type',
    accessorKey: 'cat_type',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.cat_type?.slice(0, 300),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'cat_name',
    accessorKey: 'cat_name',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.cat_name?.slice(0, 300),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'root',
    accessorKey: 'root',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.rootName,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'order',
    accessorKey: 'order',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.order,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'special',
    accessorKey: 'special',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Badge variant={row.original.special ? 'outline' : 'destructive'}>
        {row.original.special ? 'Active' : 'Inactive'}
      </Badge>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <p>
        html:{' '}
        <span className="opacity-70">
          {removeHTML(row.original.description?.slice(0, 300))}
        </span>
      </p>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  // {
  //   id: 'image',
  //   accessorKey: 'image',
  //   header: ({ column }) => <TableHeaderWrapper column={column} />,
  //   cell: ({ row }) => (
  //     <Image
  //       src={row.original.image}
  //       alt=""
  //       width={48}
  //       height={48}
  //       className="rounded-md"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableColumnFilter: false,
  // },
  {
    id: 'navigation',
    cell: Navigation,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'actions',
    cell: Action,
    enableSorting: false,
    enableColumnFilter: false,
  },
];
