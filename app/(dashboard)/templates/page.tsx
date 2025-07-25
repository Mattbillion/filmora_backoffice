import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import { buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getBranchesHash } from '@/features/branches/actions';
import { getHallsHash } from '@/features/halls/actions';
import { getVenuesHash } from '@/features/venues/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { getTemplates } from './actions';
import { templatesColumns } from './columns';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const [
    { data },
    { data: venueData },
    { data: branchData },
    { data: hallData },
  ] = await Promise.all([
    getTemplates(searchParams),
    getVenuesHash(),
    getBranchesHash(),
    getHallsHash(),
  ]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Template (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, ['create_template']) && (
          <Link
            href="/build-template"
            className={buttonVariants({ className: 'text-xs md:text-sm' })}
          >
            <Plus className="h-4 w-4" /> Template үүсгэх
          </Link>
        )}
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={templatesColumns}
          data={data?.data?.map((c) => ({
            ...c,
            venue: venueData[c.venue_id] || '',
            branch: branchData[c.branch_id] || '',
            hall: hallData[c.hall_id] || '',
          }))}
          rowCount={data?.total_count ?? data?.data?.length}
        />
      </Suspense>
    </>
  );
}
