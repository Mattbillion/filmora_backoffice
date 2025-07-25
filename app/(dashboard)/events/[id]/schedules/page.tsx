import { Suspense } from 'react';
import { CalendarPlus } from 'lucide-react';
import Link from 'next/link';

import { auth } from '@/app/(auth)/auth';
import { getEventDetail } from '@/app/(dashboard)/events/actions';
import { getTemplateHash } from '@/app/(dashboard)/templates/actions';
import { DateRangeFilter } from '@/components/custom/date-range-filter';
import { Heading } from '@/components/custom/heading';
import { ReplaceBreadcrumdItem } from '@/components/custom/replace-breadcrumd-item';
import { buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getBranchesHash } from '@/features/branches/actions';
import { getHallsHash } from '@/features/halls/actions';
import { getVenuesHash } from '@/features/venues/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { getSchedulesList } from './actions';
import { schedulesColumns } from './columns';

export const dynamic = 'force-dynamic';

export default async function ScheduleListPage(props: {
  searchParams?: SearchParams;
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const params = await props.params;
  const searchParams = await props.searchParams;
  const [
    { data },
    { data: venueData },
    { data: branchData },
    { data: hallData },
    { data: templateData },
    { data: eventData },
  ] = await Promise.all([
    getSchedulesList(params.id, searchParams),
    getVenuesHash(),
    getBranchesHash(),
    getHallsHash(),
    getTemplateHash(),
    getEventDetail(params.id),
  ]);

  return (
    <>
      <ReplaceBreadcrumdItem
        data={{
          events: {
            value: eventData?.data?.event_name,
            selector: params.id,
          },
        }}
      />
      <div className="flex items-start justify-between">
        <Heading
          title={`Эвент & Тоглолт хуваарь (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, ['create_event_schedule']) && (
          <Link
            href={`/event-schedule/${params.id}`}
            className={buttonVariants()}
          >
            <CalendarPlus size={16} />
            Хуваарь үүсгэх
          </Link>
        )}
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={schedulesColumns}
          data={data?.data?.map((c) => ({
            ...c,
            venue: venueData[c.venue_id] || '',
            hall: hallData[c.hall_id] || '',
            branch: branchData[c.branch_id] || '',
            templatePreview: templateData[c.template_id]?.preview || '',
            templateName: templateData[c.template_id]?.template_name || '',
          }))}
          rowCount={data?.total_count ?? data?.data?.length}
        >
          <div className="flex items-center gap-2">
            <DateRangeFilter fieldNames={['start_at', 'end_at']} />
          </div>
        </DataTable>
      </Suspense>
    </>
  );
}
