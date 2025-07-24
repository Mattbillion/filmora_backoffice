import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import { ReplaceBreadcrumdItem } from '@/components/custom/replace-breadcrumd-item';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getCategoryDetail } from '@/features/category/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { getAttributes } from '../../../../../features/attributes/actions';
import { categoryAttributesColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function CategoryAttributesPage(props: {
  searchParams?: SearchParams;
  params: Promise<{ id: string }>;
}) {
  const [session, { id }, searchParams] = await Promise.all([
    auth(),
    props.params,
    props.searchParams,
  ]);
  const { data: catData } = await getCategoryDetail(id);
  const { data } = await getAttributes({
    ...searchParams,
    filters: [
      searchParams?.filters || '',
      `cat_id=${id}`,
      `com_id=${session?.user?.company_id}`,
    ].join(','),
  });

  return (
    <>
      <div className="flex items-start justify-between">
        <ReplaceBreadcrumdItem
          data={{
            categories: {
              value: catData?.data?.cat_name,
              selector: id,
            },
          }}
        />
        <Heading
          title={`Category attributes list (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, ['create_category_attribute']) && (
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
          columns={categoryAttributesColumns}
          data={data?.data}
          rowCount={data?.total_count ?? data?.data?.length}
        />
      </Suspense>
    </>
  );
}
