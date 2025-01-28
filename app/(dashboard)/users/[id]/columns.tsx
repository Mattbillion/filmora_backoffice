'use client';

import { useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { BookX,Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ID } from '@/lib/fetch/types';
import { hasPermission, Role } from '@/lib/permission';

import {
  removeAlbum,
  removeBook,
  removeLecture,
  removeTraining,
} from './actions';
import { PurchaseItemType, PurchaseTypeEnum, purchaseTypeObj } from './schema';

const Action = ({ row }: CellContext<PurchaseItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const userId = params.id as unknown as ID;

  const action: Record<
    PurchaseTypeEnum,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...params: any) => Promise<any>
  > = {
    0: removeAlbum,
    1: removeLecture,
    3: removeBook,
    4: removeTraining,
  };

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, 'users.connect', 'delete')) return null;
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={'cxs'}>
          <BookX className="h-4 w-4" />
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Remove <b>{row.original.name}</b> from user&apos;s purchase
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() => {
                setLoading(true);
                action[row.original.category_type](
                  userId,
                  row.original.product_id,
                  row.original.id,
                )
                  .then((c) => {
                    toast.success(
                      c.data.message || c.data.error || c.data.data,
                    );
                    router.refresh();
                  })
                  .catch((c) => toast.error(c.message || c.error))
                  .finally(() => setLoading(false));
              }}
              disabled={loading}
            >
              {loading && <Loader2 size={10} className="animate-spin" />}
              Remove
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const purchaseColumns: ColumnDef<PurchaseItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return (
        <Link className="px-1 py-2" href={`/users/${row.original.id}`}>
          {row.original.id}
        </Link>
      );
    },
  },
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => row.original.name ?? '-',
  },
  {
    id: 'type',
    header: 'Type',
    cell: ({ row }) => purchaseTypeObj[row.original.category_type],
  },
  {
    id: 'date',
    header: 'Created At',
    cell: ({ row }) => dayjs(row.original.created_at).format('YYYY-MM-DD'),
  },
  {
    id: 'creator',
    header: 'Created By',
    cell: ({ row }) => row.original.created_by ?? '-',
  },
  {
    id: 'actions',
    cell: Action,
  },
];

export const purchaseTrainingColumns: ColumnDef<PurchaseItemType>[] = [
  ...purchaseColumns.slice(0, 3),
  {
    id: 'openedDate',
    header: 'Opened At',
    cell: ({ row }) =>
      row.original.openedDate
        ? dayjs(row.original.openedDate).format('YYYY-MM-DD')
        : '-',
  },
  {
    id: 'expireDate',
    header: 'Expires At',
    cell: ({ row }) =>
      row.original.expireDate
        ? dayjs(row.original.expireDate).format('YYYY-MM-DD')
        : '-',
  },
  ...purchaseColumns.slice(3, purchaseColumns.length),
];
