'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { ChangeEmailDialog } from '@/app/(dashboard)/employees/components/change-email-dialog';
import { DetailSheet } from '@/app/(dashboard)/employees/components/detail-sheet';
import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { Button } from '@/components/ui/button';

import { deleteEmployee } from './actions';
import { ChangePasswordDialog, UpdateDialog } from './components';
import { EmployeeItemType } from './schema';

const Action = ({ row }: CellContext<EmployeeItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);

  return (
    <div className="me-2 flex justify-end gap-4">
      <UpdateDialog
        initialData={row.original}
        key={JSON.stringify(row.original)}
      >
        <Button size={'cxs'} variant="outline">
          <Edit className="h-4 w-4" /> Edit
        </Button>
      </UpdateDialog>

      <ChangePasswordDialog initialData={row.original}>
        <Button size={'cxs'} variant="outline">
          Нууц үг солих
        </Button>
      </ChangePasswordDialog>

      <ChangeEmailDialog initialData={row.original}>
        <Button size={'cxs'} variant="outline">
          Имэйл хаяг солих
        </Button>
      </ChangeEmailDialog>

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
        <DetailSheet initialData={row.original}>{row.original.id}</DetailSheet>
      );
    },
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
    id: 'profile',
    accessorKey: 'profile',
    header: 'Profile',
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
  },
  {
    id: 'actions',
    cell: Action,
  },
];
