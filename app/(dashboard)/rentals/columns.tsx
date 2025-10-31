'use client';

import { ColumnDef } from '@tanstack/react-table';

import ZoomableImage from '@/components/custom/zoomable-image';
import { Badge } from '@/components/ui/badge';
import { MovieRentalDataType } from '@/services/schema';

export const rentalsColumns: ColumnDef<MovieRentalDataType>[] = [
  {
    id: 'poster_url',
    accessorKey: 'poster_url',
    header: () => <p>Постер зураг</p>,
    cell: ({ row }) => <ZoomableImage src={row.original.poster_url} />,
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: () => <p>Киноны нэр</p>,
    cell: ({ row }) => (
      <p className="line-clamp-1 font-semibold">{row.original.title}</p>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'total_rentals',
    accessorKey: 'total_rentals',
    header: () => <h1>Худалдаалсан тоо</h1>,
    cell: ({ row }) => (
      <p className="line-clamp-1 font-semibold">{row.original.total_rentals}</p>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'movie_id',
    accessorKey: 'movie_id',
    header: () => <p>Киноны ID</p>,
    cell: ({ row }) => (
      <p className="line-clamp-1 font-semibold">{row.original.movie_id}</p>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'is_adult',
    accessorKey: 'is_adult',
    header: () => <p>Насанд хүрэгчдийн кино эсэх</p>,
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-semibold">
        {row.original.is_adult ? 'Тийм' : 'Үгүй'}
      </Badge>
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
];
