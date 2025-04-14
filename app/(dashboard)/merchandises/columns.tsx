'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import Image from 'next/image';
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
import { currencyFormat, removeHTML } from '@/lib/utils';

import { deleteMerchandises } from './actions';
import { UpdateDialog } from './components';
import { MerchandisesItemType } from './schema';

const Action = ({ row }: CellContext<MerchandisesItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, []);
  const canEdit = checkPermission(data, []);

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
                deleteMerchandises(row.original.id)
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
                  <b className="text-foreground">{row.original.mer_name}</b>?
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

export const merchandisesColumns: ColumnDef<MerchandisesItemType>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
  },
  {
    id: 'com_id',
    accessorKey: 'com_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.com_id,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'cat_id',
    accessorKey: 'cat_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.cat_id,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'mer_name',
    accessorKey: 'mer_name',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.mer_name?.slice(0, 300),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'mer_desc',
    accessorKey: 'mer_desc',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <p>
        html:{' '}
        <span className="opacity-70">
          {removeHTML(row.original.mer_desc?.slice(0, 300))}
        </span>
      </p>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => currencyFormat(row.original.price),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'discount_id',
    accessorKey: 'discount_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.discount_id,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'medias',
    accessorKey: 'medias',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => {
      const cellData = row.original.medias;
      if (!!cellData[0]?.media_url)
        return (
          <div className="flex items-center">
            {cellData.slice(0, 3).map((c, idx) => (
              <Image
                key={idx}
                src={c.media_url}
                alt=""
                width={48}
                height={48}
                className="-mr-6 rounded-full border-border"
              />
            ))}
          </div>
        );
      return <p>{cellData.join(', ')}</p>;
    },
    enableSorting: false,
    enableColumnFilter: false,
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
