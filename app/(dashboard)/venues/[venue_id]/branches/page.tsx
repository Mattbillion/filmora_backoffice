import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import { ReplaceBreadcrumdItem } from '@/components/custom/replace-breadcrumd-item';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getBranches } from '@/features/branches/actions';
import { getVenuesDetail } from '@/features/venues/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { branchesColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function BranchesPage(props: {
  searchParams?: SearchParams;
  params: Promise<{ venue_id: string }>;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const { venue_id } = await props.params;
  const { data: venueData } = await getVenuesDetail(venue_id);
  const { data } = await getBranches({
    ...searchParams,
    filters: [searchParams?.filters || '', `venue_id=${venue_id}`].join(','),
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
        }}
      />
      <div className="flex items-start justify-between">
        <Heading
          title={`Branches list (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, ['create_branch']) && (
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
          columns={branchesColumns}
          data={data?.data}
          rowCount={data?.total_count ?? data?.data?.length}
        />
      </Suspense>
    </>
  );
}
