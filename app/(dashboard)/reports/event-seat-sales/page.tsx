import { auth } from '@/app/(auth)/auth';
import { MultipleLineChart } from '@/app/(dashboard)/reports/charts/MultipleLineChart';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/lib/fetch/types';

import { getEventSeatSalesDetail } from './actions';

export const dynamic = 'force-dynamic';

export default async function EventSeatSalesPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const { data } = await getEventSeatSalesDetail(28);

  return (
    <>
      {/*<div className="flex items-start justify-between">*/}
      {/*  <Heading*/}
      {/*    title={`Event seat sales list (${data?.total_count ?? data?.data?.length})`}*/}
      {/*  />*/}
      {/*</div>*/}
      <Separator />
      <MultipleLineChart />
    </>
  );
}
