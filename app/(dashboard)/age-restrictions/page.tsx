import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { Heading } from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/lib/fetch/types';

import { getAgeRestrictionsList } from './actions';
import { ageRestrictionsColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function AgeRestrictionsPage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { data } = await getAgeRestrictionsList(searchParams);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`AgeRestrictions list (${data?.pagination?.total ?? data?.data?.length})`}
        />
        <CreateDialog>
          <Button className="text-xs md:text-sm">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </CreateDialog>
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={ageRestrictionsColumns}
          data={data?.data}
          pageNumber={data?.pagination?.nextPage - 1}
          pageCount={data?.pagination?.pageCount}
        />
      </Suspense>
    </>
  );
}
