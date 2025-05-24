'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { deleteEmployee } from './actions';
import { EmployeeItemType } from './schema';

const Action = ({ row }: CellContext<EmployeeItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);

  return (
    <div className="me-2 flex justify-end gap-4">
      <DeleteDialog
        ref={deleteDialogRef}
        loading={loading}
        action={() => {
          setLoading(true);
          deleteEmployee(row.original.id)
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
            <b className="text-foreground">{row.original.firstname}</b>?
          </>
        }
      >
        <Button size={'cxs'}>
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </DeleteDialog>
    </div>
  );
};

export const employeeColumns: ColumnDef<EmployeeItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return (
        <Link
          href={`/employees/${row.original.id}`}
          className="hover:underline"
        >
          {row.original.id}
        </Link>
      );
    },
  },
  {
    id: 'profile',
    accessorKey: 'profile',
    header: 'Profile',
    cell: ({ row }) => (
      <Image
        src={row.original.profile}
        alt=""
        width={48}
        height={48}
        className="rounded-md"
      />
    ),
  },
  {
    id: 'firstname',
    accessorKey: 'firstname',
    header: 'Firstname',
  },
  {
    id: 'lastname',
    accessorKey: 'lastname',
    header: 'Lastname',
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'email_verified',
    accessorKey: 'email_verified',
    header: 'Email verified',
  },
  {
    id: 'company_id',
    accessorKey: 'company_id',
    header: 'Company id',
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'last_logged_at',
    accessorKey: 'last_logged_at',
    header: 'Last logged at',
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.last_logged_at
          ? dayjs(row.original.last_logged_at).format('YYYY-MM-DD hh:mm')
          : undefined}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: Action,
  },
];
