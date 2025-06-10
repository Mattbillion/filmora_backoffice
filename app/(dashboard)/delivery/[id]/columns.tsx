'use client';

import { useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { toast } from 'sonner';

import { markAsDelivered } from '@/app/(dashboard)/delivery/actions';
import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { Button } from '@/components/ui/button';

import { DeliveryItem } from '../schema';

const Action = ({ row }: CellContext<DeliveryItem, unknown>) => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="secondary"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        // TODO: Please check after generate
        markAsDelivered(row.original.delivery_id)
          .then((c) => toast.success('Successfully marked as delivered.'))
          .catch((c) => toast.error(c.message))
          .finally(() => setLoading(false));
      }}
    >
      Mark as delivered
    </Button>
  );
};

export const deliveryColumns: ColumnDef<
  DeliveryItem & {
    canModify?: boolean;
  }
>[] = [
  {
    id: 'delivery_id',
    accessorKey: 'delivery_id',
    header: () => <div className="w-14">ID</div>,
    cell: ({ row }) => row.original.delivery_id,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'tracking_number',
    accessorKey: 'tracking_number',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.tracking_number,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'delivery_item',
    header: () => <div className="w-[300px]">Delivery item</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2" key={row.original.item.id}>
        <img
          src={
            (row.original.item.variant_details?.medias || [])[0]?.media_url ||
            row.original.item.seat_details?.event?.event_image
          }
          alt=""
          className="h-10 w-10 rounded-lg object-cover"
        />
        <div className="flex-1">
          {row.original.item.variant_details && (
            <p className="truncate text-base font-bold">
              {row.original.item.variant_details?.mer_name}
            </p>
          )}
          {row.original.item.seat_details && (
            <>
              <p className="truncate text-base font-bold">
                {row.original.item.seat_details?.event?.event_name}
              </p>
              <p className="text-xs">
                {row.original.item.seat_details?.seat_name}
              </p>
            </>
          )}
        </div>
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    id: 'delivery_status',
    accessorKey: 'delivery_status',
    header: () => <div className="w-20">Status</div>,
    cell: ({ row }) => row.original.delivery_status,
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    id: 'delivery_date',
    accessorKey: 'delivery_date',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) =>
      row.original.delivery_date
        ? dayjs(row.original.delivery_date).format('YYYY/MM/DD hh:mm:ss')
        : undefined,

    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'delivery_date',
    cell: Action,
  },
];
