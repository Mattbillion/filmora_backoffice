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

import { CreateDialog } from '../../components';
import { getTemplates } from './actions';
import { templatesColumns } from './columns';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage(props: {
  searchParams?: SearchParams;
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const [
    { data },
    { data: venueData },
    { data: branchData },
    { data: hallData },
  ] = await Promise.all([
    getTemplates({
      ...searchParams,
      event_id: id,
    }),
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
          <CreateDialog>
            <Link
              href={`/build-template?eventId=${id}`}
              className={buttonVariants({ className: 'text-xs md:text-sm' })}
            >
              <Plus className="h-4 w-4" /> Template үүсгэх
            </Link>
          </CreateDialog>
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
