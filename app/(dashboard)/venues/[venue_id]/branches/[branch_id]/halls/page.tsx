import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import { ReplaceBreadcrumdItem } from '@/components/custom/replace-breadcrumd-item';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getBranchesDetail } from '@/features/branches/actions';
import { getHalls } from '@/features/halls/actions';
import { getVenuesDetail } from '@/features/venues/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { hallsColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function HallsPage(props: {
  searchParams?: SearchParams;
  params: Promise<{ venue_id: string; branch_id: string }>;
}) {
  const [session, searchParams, { venue_id, branch_id }] = await Promise.all([
    auth(),
    props.searchParams,
    props.params,
  ]);
  const { data: venueData } = await getVenuesDetail(venue_id);
  const { data: branchData } = await getBranchesDetail(branch_id);
  const { data } = await getHalls({
    ...searchParams,
    filters: [
      searchParams?.filters || '',
      `venue_id=${venue_id}`,
      `branch_id=${branch_id}`,
    ].join(','),
    company_id: session?.user?.company_id,
  });

  return (
    <>
      <ReplaceBreadcrumdItem
        data={{
          venues: {
            value: venueData?.data?.venue_name,
            selector: venue_id,
          },
          branches: {
            value: branchData?.data?.branch_name,
            selector: branch_id,
          },
        }}
      />
      <div className="flex items-start justify-between">
        <Heading
          title={`Halls list (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, ['create_hall']) && (
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
          columns={hallsColumns}
          data={data?.data}
          rowCount={data?.total_count ?? data?.data?.length}
        />
      </Suspense>
    </>
  );
}
