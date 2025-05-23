import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import { SearchInput } from '@/components/custom/table/search-input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getDiscounts } from '@/features/discounts/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { discountsColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function DiscountsPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await auth();

  const searchParams = await props.searchParams;
  const { data } = await getDiscounts({
    ...searchParams,
    company_id: session?.user?.company_id,
  });

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Discounts list (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, ['create_discount']) && (
          <CreateDialog>
            <Button className="text-xs md:text-sm">
              <Plus className="h-4 w-4" /> Add New
            </Button>
          </CreateDialog>
        )}
      </div>
      <Separator />

      {/*<DateRangeFilter />*/}
      <Suspense fallback="Loading">
        <DataTable
          columns={discountsColumns}
          data={data?.data}
          rowCount={data?.total_count ?? data?.data?.length}
        >
          <SearchInput
            filterField="discount_name"
            paramKey="filters"
            placeholder="Нэрээр хайх"
          />
        </DataTable>
      </Suspense>
    </>
  );
}
