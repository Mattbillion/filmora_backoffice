'use client';

import { CellContext, ColumnDef } from '@tanstack/react-table';
import { ListTree } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { RoleItemType } from '@/features/role/schema';
import { checkPermission } from '@/lib/permission';

const ChildData = ({ row }: CellContext<RoleItemType, unknown>) => {
  const router = useRouter();
  const { data } = useSession();
  if (!checkPermission(data, ['get_role_by_permission_list'])) return null;

  return (
    <div className="me-2 flex justify-end gap-4">
      <Button
        size={'cxs'}
        variant="outline"
        type="button"
        onClick={() => router.push(`/role/${row.original.id}`)}
      >
        <ListTree className="h-4 w-4" /> Permissions
      </Button>
    </div>
  );
};

export const roleColumns: ColumnDef<RoleItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    id: 'role_name',
    header: 'Name',
    cell: ({ row }) => row.original.role_name,
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => (row.original.status ? 'Active' : 'Inactive'),
  },
  {
    id: 'actions',
    cell: ChildData,
  },
];
