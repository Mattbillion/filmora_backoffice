'use client';

import { useRef, useState } from 'react';
import { currencyFormat } from '@interpriz/lib/utils';
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
import { hasPermission } from '@/lib/permission';
import { deleteMovie } from '@/services/movies-generated';
import { MovieListResponseType } from '@/services/schema';

import UpdateMovie from './update-movie';

const Action = ({ row }: CellContext<MovieListResponseType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = hasPermission(data, 'movies', 'delete');
  const canEdit = hasPermission(data, 'movies', 'update');
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

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
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {canEdit && (
            <DropdownMenuItem onClick={() => setEditDrawerOpen(true)}>
              <Edit className="h-4 w-4" /> Edit
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DeleteDialog
              ref={deleteDialogRef}
              loading={loading}
              action={() => {
                setLoading(true);
                // TODO: Please check after generate
                deleteMovie(row.original.id.toString())
                  .then((c) =>
                    toast.success(c.message || 'Movie deleted successfully'),
                  )
                  .catch((c) =>
                    toast.error(c.message || 'Failed to delete movie'),
                  )
                  .finally(() => {
                    deleteDialogRef.current?.close();
                    setLoading(false);
                  });
              }}
              description={
                <>
                  Are you sure you want to delete this{' '}
                  <b className="text-foreground">{row.original.title}</b>?
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
      {canEdit && (
        <UpdateMovie
          id={row.original.id.toString()}
          buttonVariant="ghost"
          editDrawerOpen={editDrawerOpen}
          setEditDrawerOpen={setEditDrawerOpen}
        />
      )}
    </div>
  );
};

export const moviesColumns: ColumnDef<MovieListResponseType>[] = [
  {
    id: 'poster_url',
    accessorKey: 'poster_url',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <div className="relative size-16 overflow-hidden rounded-md">
        <Image
          src={row.original.poster_url ?? ''}
          alt="Poster"
          fill
          className="absolute inset-0 -z-10 blur-sm"
        />
        <Image
          src={row.original.poster_url ?? ''}
          alt="Poster"
          fill
          className="object-contain"
        />
      </div>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: () => <h1>Киноны нэр</h1>,
    cell: ({ row }) => (
      <h1 className="line-clamp-1 font-semibold">{row.original.title}</h1>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: () => <h1>Төрөл</h1>,
    cell: ({ row }) =>
      row.original.type === 'movie' ? 'Нэг ангит кино' : 'Олон ангит сериал',
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'year',
    accessorKey: 'year',
    header: () => <h1>Кино гарсан огноо</h1>,
    cell: ({ row }) => row.original.year,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: () => <h1>Үнийн дүн</h1>,
    cell: ({ row }) => currencyFormat(row.original.price ?? 0),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'is_premium',
    accessorKey: 'is_premium',
    header: () => <h1>Premium</h1>,

    cell: ({ row }) => (row.original.is_premium ? 'Active' : 'Inactive'),
    enableSorting: false,
    enableColumnFilter: true,
  },

  {
    id: 'is_adult',
    accessorKey: 'is_adult',
    header: () => <h1>Насанд хүрэгчдэд эсэх</h1>,
    cell: ({ row }) => (row.original.is_adult ? 'Тийм' : 'Үгүй'),
    enableSorting: false,
    enableColumnFilter: true,
  },

  {
    id: 'actions',
    cell: Action,
  },
];
