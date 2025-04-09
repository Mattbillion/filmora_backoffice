import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { roleColumns } from '@/app/(dashboard)/role/columns';
import { Heading } from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getRoleList } from '@/features/role/actions';
import { SearchParams } from '@/lib/fetch/types';

import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function RolePage(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const { data } = await getRoleList(searchParams);
  const session = await auth();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Role list (${data?.pagination?.total ?? data?.data?.length})`}
        />
        {session?.user?.permissions?.includes('create_role') && (
          <CreateDialog>
            <Button className="text-xs md:text-sm">
              <Plus className="h-4 w-4" /> Add New
            </Button>
          </CreateDialog>
        )}
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={roleColumns}
          data={data?.data}
          pageNumber={data?.pagination?.nextPage - 1}
          pageCount={data?.pagination?.pageCount}
        />
      </Suspense>
    </>
  );
}
