'use client';

import { ColumnDef } from '@tanstack/react-table';

import { PermissionByRoleItemType } from '@/features/permission/schema';

export const permissionColumns: ColumnDef<PermissionByRoleItemType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    id: 'permission_name',
    header: 'Name',
    accessorKey: 'permission_name',
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => (row.original.status ? 'Active' : 'Inactive'),
  },
];
