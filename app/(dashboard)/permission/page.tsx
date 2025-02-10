import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { Heading } from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/lib/fetch/types';

import { getPermissionList } from './actions';
import { permissionColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function PermissionPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { data } = await getPermissionList(searchParams);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Permission list (${data?.pagination?.total ?? data?.data?.length})`}
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
          data={data?.data}
          pageNumber={data?.pagination?.nextPage - 1}
          pageCount={data?.pagination?.pageCount}
        />
      </Suspense>
    </>
  );
}
