'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { deleteMerchandises } from '@/app/(dashboard)/merchandises/actions';
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
import { checkPermission } from '@/lib/permission';
import { currencyFormat, removeHTML } from '@/lib/utils';

import { MerchandisesItemType } from './schema';

const Action = ({
  row,
}: CellContext<
  MerchandisesItemType & {
    company: string;
    category?: string;
    discount?: string;
    canModify?: boolean;
  },
  unknown
>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, ['delete_event']);
  const router = useRouter();
  if (!row?.original?.canModify && !canDelete) return null;

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
          {row.original.category && (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                router.push(`/merchandises/${row.original.id}`);
              }}
            >
              <Edit className="h-4 w-4" /> Edit
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DeleteDialog
              ref={deleteDialogRef}
              loading={loading}
              action={() => {
                setLoading(true);
                deleteMerchandises(row?.original.id)
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

export const merchandisesColumns: ColumnDef<
  MerchandisesItemType & {
    company: string;
    category?: string;
    discount?: string;
    canModify?: boolean;
  }
>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.original.id,
  },
  {
    id: 'mer_name',
    accessorKey: 'mer_name',
    header: 'Барааны нэр',
    cell: ({ row }) => (
      <p className="w-[200px] text-nowrap">{row.original.mer_name}</p>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'category',
    accessorKey: 'cat_id',
    header: 'Категори',
    cell: ({ row }) => <p className="text-nowrap">{row.original.category}</p>,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'company',
    accessorKey: 'company',
    header: 'Компани',
    cell: ({ row }) => (
      <p className="w-max text-nowrap">{row.original.company}</p>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },

  {
    id: 'price',
    accessorKey: 'price',
    header: 'Үнэ',
    cell: ({ row }) => (
      <span className="font-medium">{currencyFormat(row.original.price)}</span>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'discount',
    accessorKey: 'discount',
    header: 'Хямдрал',
    cell: ({ row }) => (
      <p className="max-w-[254px] truncate">{row.original.discount_id}</p>
    ),
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
            {cellData.slice(0, 3).map((c, idx) => {
              return (
                <div
                  className="relative -mr-2 size-10 overflow-hidden rounded-full border-border object-cover"
                  key={idx}
                >
                  <Image
                    src={c.media_url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              );
            })}
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
    cell: ({ row }) => (
      <Badge variant={row.original.status ? 'outline' : 'destructive'}>
        {row.original.status ? 'Идэвхтэй' : 'Идэвхгүй'}
      </Badge>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },

  {
    id: 'mer_desc',
    accessorKey: 'mer_desc',
    header: 'Дэлгэрэнгүй',
    cell: ({ row }) => (
      <p className="max-w-[256px] truncate">
        html:{' '}
        <span className="opacity-70">
          {removeHTML(row.original.mer_desc?.slice(0, 300))}
        </span>
      </p>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  { id: 'action', header: 'Action', cell: Action },
];
