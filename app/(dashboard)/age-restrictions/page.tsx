import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import StatusFilter from '@/components/custom/table/status-filter';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { getAgeRestrictions } from '@/features/age/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { ageRestrictionsColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function AgeRestrictionsPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const { data } = await getAgeRestrictions({
    ...searchParams,
    company_id: session?.user?.company_id,
  });

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Насны хязгаарлалтууд (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, ['create_age_restriction']) && (
          <CreateDialog>
            <Button className="text-xs md:text-sm">
              <Plus className="h-4 w-4" /> Насны хязгаар нэмэх
            </Button>
          </CreateDialog>
        )}
      </div>

      <Suspense fallback="Loading">
        <DataTable
          columns={ageRestrictionsColumns}
          data={data?.data}
          rowCount={data?.total_count ?? data?.data?.length}
        >
          <StatusFilter
            options={[
              { value: 'false', label: 'InActive' },
              { value: 'true', label: 'Active' },
            ]}
          />
        </DataTable>
      </Suspense>
    </>
  );
}
