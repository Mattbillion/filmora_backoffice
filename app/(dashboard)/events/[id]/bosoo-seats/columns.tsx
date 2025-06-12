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
import { currencyFormat } from '@/lib/utils';

import { deleteBosooSeats } from './actions';
import { UpdateDialog } from './components';
import { BosooSeatsItemType } from './schema';

const Action = ({ row }: CellContext<BosooSeatsItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, ['delete_bosoo_seat']);
  const canEdit = checkPermission(data, ['update_bosoo_seat']);

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
                deleteBosooSeats(row.original.id, data?.user?.company_id!)
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
                  <b className="text-foreground">{row.original.seat_name}</b>?
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

export const bosooSeatsColumns: ColumnDef<
  BosooSeatsItemType & { discount?: string }
>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
  },
  {
    id: 'seat_name',
    accessorKey: 'seat_name',
    header: 'Суудлын нэр',
    cell: ({ row }) => row.original.seat_name?.slice(0, 300),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Үнэ',
    cell: ({ row }) => currencyFormat(row.original.price),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'is_reserved',
    accessorKey: 'is_reserved',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.is_reserved?.slice(0, 300),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'section_type',
    accessorKey: 'section_type',
    header: 'Суудлын төрөл',
    cell: ({ row }) => row.original.section_type?.slice(0, 300),
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
    id: 'seat_stock',
    accessorKey: 'seat_stock',
    header: 'Суудлын тоо',
    cell: ({ row }) => row.original.seat_stock,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'selled_stock',
    accessorKey: 'selled_stock',
    header: 'Зарагдсан тоо',
    cell: ({ row }) => row.original.selled_stock,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'discount_id',
    accessorKey: 'discount_id',
    header: 'Хямдрал',
    cell: ({ row }) => (
      <p className="max-w-[254px] truncate">{row.original.discount}</p>
    ),
  },
  {
    id: 'current_stock',
    accessorKey: 'current_stock',
    header: 'Үлдэгдэл',
    cell: ({ row }) => row.original.current_stock,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'sell_type',
    accessorKey: 'sell_type',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.sell_type?.slice(0, 300),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'actions',
    cell: Action,
  },
];
