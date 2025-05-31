import { EventSeatSalesChart } from '@/app/(dashboard)/reports/charts/EventSeatSalesChart';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/lib/fetch/types';

import { getEventSeatSalesDetail } from './actions';

export const dynamic = 'force-dynamic';

export default async function EventSeatSalesPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const eventId = searchParams?.eventId;
  if (searchParams?.eventId) searchParams.event_id = searchParams?.eventId;

  const { data } = await getEventSeatSalesDetail(searchParams);
  const chartData = data?.data;

  return (
    <>
      <Separator />
      {chartData && (
        <EventSeatSalesChart
          chartData={chartData}
          eventId={eventId as string}
        />
      )}
    </>
  );
}
