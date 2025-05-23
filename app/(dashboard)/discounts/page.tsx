import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { discountsColumns } from '@/app/(dashboard)/discounts/columns';
import { DateRangeFilter } from '@/components/custom/date-range-filter';
import { Heading } from '@/components/custom/heading';
import StatusFilter from '@/components/custom/table/status-filter';
import TypeFilter from '@/components/custom/table/type-filter';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { getDiscounts } from '@/features/discounts/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

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
      <div className="inline-flex items-center justify-between">
        <Heading
          title={`Хямдралууд (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, ['create_discount']) && (
          <CreateDialog>
            <Button className="text-xs md:text-sm" variant="default">
              <Plus className="h-4 w-4" /> Хямдрал нэмэх
            </Button>
          </CreateDialog>
        )}
      </div>

      <Suspense fallback="Loading">
        <DataTable columns={discountsColumns} data={data?.data}>
          <div className="flex items-center gap-2">
            <StatusFilter />
            <TypeFilter />
            <DateRangeFilter />
          </div>
        </DataTable>
      </Suspense>
    </>
  );
}
