'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Edit, GitBranch, MoreHorizontal, Trash } from 'lucide-react';
import Image from 'next/image';
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
import { deleteVenuesDetail } from '@/features/venues/actions';
import { VenuesItemType } from '@/features/venues/schema';
import { checkPermission } from '@/lib/permission';
import { cn, removeHTML } from '@/lib/utils';

import { UpdateDialog } from './components';

const Action = ({ row }: CellContext<VenuesItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, ['delete_venue']);
  const canEdit = checkPermission(data, ['update_venue']);

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
                deleteVenuesDetail(row.original.id)
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

const Navigation = ({ row }: CellContext<VenuesItemType, unknown>) => {
  const { data } = useSession();

  if (
    !checkPermission(data, [
      'get_branch_list',
      'get_branch',
      'create_branch',
      'update_branch',
      'delete_branch',
    ])
  )
    return null;
  return (
    <Link
      href={`/venues/${row.original.id}/branches`}
      className={cn(buttonVariants({ variant: 'outline', size: 'cxs' }))}
    >
      <GitBranch className="h-4 w-4" /> Branches
    </Link>
  );
};

export const venuesColumns: ColumnDef<VenuesItemType>[] = [
  {
    accessorKey: 'id',
    header: 'Venue ID',
  },
  {
    id: 'venue_logo',
    accessorKey: 'venue_logo',
    header: 'Image',
    cell: ({ row }) => (
      <div className="relative aspect-square size-8 overflow-hidden rounded-lg">
        <Image
          src={row.original.venue_logo}
          alt=""
          fill
          className="object-cover"
        />
      </div>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'venue_name',
    accessorKey: 'venue_name',
    header: 'Venue name',
    cell: ({ row }) => <p className="truncate">{row.original.venue_name}</p>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'venue_location',
    accessorKey: 'venue_location',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.venue_location?.slice(0, 300),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Төлөв',

    cell: ({ row }) => (
      <Badge variant={row.original.status ? 'outline' : 'destructive'}>
        {row.original.status ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    id: 'venue_desc',
    accessorKey: 'venue_desc',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <p className="line-clamp-2 w-[256px]">
        html:{' '}
        <span className="opacity-70">
          {removeHTML(row.original.venue_desc?.slice(0, 300))}
        </span>
      </p>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'navigation',
    header: 'Childrens',
    cell: Navigation,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: Action,
  },
];
