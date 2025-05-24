'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import Image from 'next/image';
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
import { checkPermission } from '@/lib/permission';

import { deleteEmployee } from './actions';
import { EmployeeItemType } from './schema';

const Action = ({
  row,
}: CellContext<
  EmployeeItemType & { canModify: boolean; company_name: string },
  unknown
>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, ['delete_company_employee']) || true;
  const canEdit =
    checkPermission(data, [
      'get_company_employee_info',
      'update_company_employee',
      'update_company_employee_email',
      'update_company_employee_password',
    ]) || true;
  return (
    <div className="me-2 flex justify-end gap-4">
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
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="h-4 w-4" /> Edit
              </DropdownMenuItem>
            )}
            {canDelete && (
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
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DeleteDialog>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const employeeColumns: ColumnDef<
  EmployeeItemType & { canModify: boolean; company_name: string }
>[] = [
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
    id: 'company_name',
    accessorKey: 'company_name',
    header: 'company_name',
    cell: ({ row }) => (
      <p className="font-medium">{row.original.company_name}</p>
    ),
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: 'Утасны дугаар',
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
    cell: ({ row }) => (
      <Badge variant={row.original.email_verified ? 'outline' : 'destructive'}>
        {row.original.email_verified ? 'Verified' : 'Not Verified'}
      </Badge>
    ),
  },
  // {
  //   id: 'company_id',
  //   accessorKey: 'company_id',
  //   header: 'Company id',
  // },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status ? 'outline' : 'destructive'}>
        {row.original.status ? 'Идэвхтэй' : 'Идэвхгүй'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: Action,
  },
];
