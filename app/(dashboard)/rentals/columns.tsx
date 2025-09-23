'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { MovieRentalDataType } from '@/services/schema';

export const rentalsColumns: ColumnDef<MovieRentalDataType>[] = [
  {
    id: 'poster_url',
    accessorKey: 'poster_url',
    header: () => <h1>Постер зураг</h1>,
    cell: ({ row }) => (
      <div className="relative size-14 overflow-hidden rounded-md">
        <Image
          src={row.original.poster_url ?? ''}
          alt="Poster"
          fill
          className="object-cover"
        />
      </div>
    ),
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
    id: 'total_rentals',
    accessorKey: 'total_rentals',
    header: () => <h1>Нийт дэлгэцүүд</h1>,
    cell: ({ row }) => (
      <h1 className="line-clamp-1 font-semibold">
        {row.original.total_rentals}
      </h1>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'movie_id',
    accessorKey: 'movie_id',
    header: () => <h1>Киноны ID</h1>,
    cell: ({ row }) => (
      <h1 className="line-clamp-1 font-semibold">{row.original.movie_id}</h1>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'is_adult',
    accessorKey: 'is_adult',
    header: () => <h1>Насанд хүрэгчдийн кино эсэх</h1>,
    cell: ({ row }) => (
      <h1 className="line-clamp-1 font-semibold">
        <Badge variant="secondary">
          {row.original.is_adult ? 'Тийм' : 'Үгүй'}
        </Badge>
      </h1>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
];
