'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';

import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { currencyFormat, removeHTML } from '@/lib/utils';

import { MerchandisesItemType } from './schema';

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
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) =>
      row.original.canModify ? (
        <Link href={`/merchandises/${row.original.id}`}>{row.original.id}</Link>
      ) : (
        row.original.id
      ),
  },
  {
    id: 'company',
    accessorKey: 'company',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.company,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'category',
    accessorKey: 'cat_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.category,
    enableSorting: false,
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
    cell: ({ row }) => row.original.discount || row.original.discount_id,
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
                <Image
                  key={idx}
                  src={c.media_url}
                  alt=""
                  width={48}
                  height={48}
                  className="-mr-6 rounded-full border-border"
                />
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
    cell: ({ row }) => (row.original.status ? 'Active' : 'Inactive'),
    enableSorting: false,
    enableColumnFilter: true,
  },
];
