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
import { deleteDiscountsDetail } from '@/features/discounts/actions';
import { DiscountsItemType } from '@/features/discounts/schema';
import { checkPermission } from '@/lib/permission';
import { removeHTML } from '@/lib/utils';

import { UpdateDialog } from './components';

const Action = ({ row }: CellContext<DiscountsItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, ['delete_discount']);
  const canEdit = checkPermission(data, ['update_discount']);

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
              title="Та энэхүү үйлдэлийг хийхдээ итгэлтэй байна уу?"
              confirmText="Үргэлжлүүлэх"
              cancelText="Шаасиймаа"
              ref={deleteDialogRef}
              loading={loading}
              action={() => {
                setLoading(true);
                // TODO: Please check after generate
                deleteDiscountsDetail(row.original.id)
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
                    {row.original.discount_name}
                  </b>
                  ?
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

export const discountsColumns: ColumnDef<DiscountsItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    id: 'discount_name',
    accessorKey: 'discount_name',
    header: 'Discount name',
    cell: ({ row }) => <div className="">{row.original.discount_name}</div>,
  },
  {
    id: 'discount_desc',
    accessorKey: 'discount_desc',
    header: () => <p className="font-medium">Discount description</p>,
    cell: ({ row }) => (
      <div className="max-w-[156px] truncate">
        {removeHTML(row.original.discount_desc?.slice(0, 300))}
      </div>
    ),
  },
  {
    id: 'discount_type',
    accessorKey: 'discount_type',
    header: 'Discount type',
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.discount_type === 'PERCENT' ? 'Хувиар' : 'Дүнгээр'}
      </Badge>
    ),
  },
  {
    id: 'discount',
    accessorKey: 'discount',
    header: 'Discount Value',
    cell: ({ row }) => {
      const type = row.original.discount_type;
      const value = row.original.discount;

      const formatted =
        type === 'PERCENT' ? `${value}%` : `${value.toLocaleString()}₮`;

      return (
        <Badge variant="outline" className="text-end">
          {formatted}
        </Badge>
      );
    },
  },
  {
    id: 'start_at',
    accessorKey: 'start_at',
    header: 'Эхлэх огноо',
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.start_at
          ? dayjs(row.original.start_at).format('YYYY-MM-DD hh:mm')
          : undefined}
      </Badge>
    ),

    filterFn: (row, columnId, filterValue) => {
      const cellDate = dayjs(row.getValue(columnId));
      const start = dayjs(filterValue?.start);
      const end = dayjs(filterValue?.end);

      if (!start.isValid() || !end.isValid()) return true;
      return cellDate.isAfter(start) && cellDate.isBefore(end);
    },
  },
  {
    id: 'end_at',
    accessorKey: 'end_at',
    header: 'Дуусах огноо',
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.end_at
          ? dayjs(row.original.end_at).format('YYYY-MM-DD hh:mm')
          : undefined}
      </Badge>
    ),
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
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: Action,
  },
];
