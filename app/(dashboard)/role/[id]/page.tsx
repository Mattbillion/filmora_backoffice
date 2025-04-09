import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import {
  getPermissionList,
  getPermissionsByRoleId,
} from '@/features/permission/actions';
import { getRoleList } from '@/features/role/actions';
import { ID, SearchParams } from '@/lib/fetch/types';

import { permissionColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function RoleDetailPage(props: {
  searchParams?: SearchParams;
  params: Promise<{ id: ID }>;
}) {
  const [searchParams, params, session] = await Promise.all([
    props.searchParams,
    props.params,
    auth,
  ]);
  const { id } = params;

  const [{ data: roleData }, { data: permissionListData }, { data }] =
    await Promise.all([
      getRoleList(searchParams),
      getPermissionList(searchParams),
      getPermissionsByRoleId(id, searchParams),
    ]);

  const currentRole = roleData?.data?.find((c) => c.id === Number(id));
  const permissionNameObj: Record<ID, string> =
    permissionListData?.data?.reduce(
      (acc, cur) => ({ ...acc, [cur.id]: cur.permission_name }),
      {},
    );

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`${currentRole?.role_name + ' '}Permission list (${data?.pagination?.total ?? data?.data?.length})`}
        />
        <CreateDialog>
          <Button className="text-xs md:text-sm">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </CreateDialog>
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={permissionColumns}
          data={data?.data?.map((c) => ({
            ...c,
            permission_name: permissionNameObj[c.id],
          }))}
          pageNumber={data?.pagination?.nextPage - 1}
          pageCount={data?.pagination?.pageCount}
        />
      </Suspense>
    </>
  );
}
