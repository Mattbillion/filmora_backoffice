import { auth } from '@/app/(auth)/auth';
import { SalesStackedBarChart } from '@/app/(dashboard)/reports/charts/SalesStackedBarChart';
import { Heading } from '@/components/custom/heading';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/lib/fetch/types';

import { getCompanySales } from './actions';

export const dynamic = 'force-dynamic';

export default async function CompanySalesPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const { data } = await getCompanySales({
    ...searchParams,
    company_id: session?.user?.company_id,
  });

  console.log(data, 'dadada');

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Company sales list (${data?.total_count ?? data?.data?.length})`}
        />
      </div>
      <Separator />
      <SalesStackedBarChart data={data?.data} />
    </>
  );
}
