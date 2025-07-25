import { Suspense } from 'react';
import { Ticket } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { DateRangeFilter } from '@/components/custom/date-range-filter';
import { Heading } from '@/components/custom/heading';
import InputFilter from '@/components/custom/input-filter';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getAgeRestrictionsHash } from '@/features/age/actions';
import { getCategoriesHash } from '@/features/category/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { getEventsList } from './actions';
import { eventsColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function EventsPage(props: {
  searchParams?: SearchParams;
}) {
  // age_id venue_id branch_id hall_id
  const session = await auth();
  const searchParams = await props.searchParams;
  const [{ data }, { data: categoryData }, { data: ageData }] =
    await Promise.all([
      getEventsList({
        ...searchParams,
        company_id: session?.user?.company_id,
      }),
      getCategoriesHash(),
      getAgeRestrictionsHash(),
    ]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Эвент & Тоглолт (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, ['create_event']) && (
          <CreateDialog>
            <Button className="text-xs md:text-sm">
              <Ticket size={16} />
              Эвент үүсгэх
            </Button>
          </CreateDialog>
        )}
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={eventsColumns}
          data={data?.data?.map((c) => ({
            ...c,
            category: categoryData[c.category_id] || '',
            age: ageData[c.age_id] || '',
            canModify: checkPermission(session, [
              'get_event',
              'update_event',
              'delete_event',
              'create_event_schedule',
            ]),
          }))}
          rowCount={data?.total_count ?? data?.data?.length}
        >
          <div className="flex items-center gap-2">
            <InputFilter
              name={'filters.event_name'}
              placeholder={'Нэрээр хайх'}
            />
            <DateRangeFilter fieldNames={['start_date', 'end_date']} />
          </div>
        </DataTable>
      </Suspense>
    </>
  );
}
