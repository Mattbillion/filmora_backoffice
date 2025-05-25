import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import InputFilter from '@/components/custom/input-filter';
import StatusFilter from '@/components/custom/table/status-filter';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getCategories, getCategoriesHash } from '@/features/category/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { categoryColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function CategoryPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const [{ data }, { data: dataHash }] = await Promise.all([
    getCategories(searchParams),
    getCategoriesHash(),
  ]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Category list (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, ['create_category']) && (
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
          columns={categoryColumns}
          data={data?.data?.map((c) => ({
            ...c,
            rootName: c.root ? dataHash[c.root] : undefined,
          }))}
          rowCount={data?.total_count ?? data?.data?.length}
        >
          <div className="flex items-center gap-2">
            <InputFilter
              name={'filters.cat_name'}
              placeholder={'Нэрээр хайх'}
            />
            <StatusFilter
              name={'filters.special'}
              options={[
                { value: 'false', label: 'InActive' },
                { value: 'true', label: 'Active' },
              ]}
            />
          </div>
        </DataTable>
      </Suspense>
    </>
  );
}
