import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { getEventDetail } from '@/app/(dashboard)/events/actions';
import { Heading } from '@/components/custom/heading';
import { ReplaceBreadcrumdItem } from '@/components/custom/replace-breadcrumd-item';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getDiscountsHash } from '@/features/discounts/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { getBosooSeats } from './actions';
import { bosooSeatsColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function BosooSeatsPage(props: {
  searchParams?: SearchParams;
  params: Promise<{ id: string }>;
}) {
  const [session, searchParams, params] = await Promise.all([
    auth(),
    props.searchParams,
    props.params,
  ]);
  const [{ data }, { data: discountData }, { data: eventData }] =
    await Promise.all([
      getBosooSeats({
        ...searchParams,
        company_id: session?.user?.company_id,
        event_id: params.id,
      }),
      getDiscountsHash({ company_id: session?.user?.company_id }),
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
          title={`Bosoo seats list (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, ['create_bosoo_seat']) && (
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
          columns={bosooSeatsColumns}
          data={data?.data.map((c) => ({
            ...c,
            discount: discountData[c.discount_id!] || '',
          }))}
          rowCount={data?.total_count ?? data?.data?.length}
        />
      </Suspense>
    </>
  );
}
