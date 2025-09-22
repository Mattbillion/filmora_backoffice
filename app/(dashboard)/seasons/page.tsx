import { Suspense } from 'react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/services/api/types';
import { getSeriesSeasons } from '@/services/seasons';

import { seasonsColumns } from './columns';

export const dynamic = 'force-dynamic';

export default async function SeasonsPage(props: {
  searchParams?: SearchParams<{
    page?: number;
    page_size?: number;
  }>;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const { data } = await getSeriesSeasons(
    '-1', // movieId: string  // Check and fix, its generated and might be dumb
    searchParams,
  );

  const list = data?.data || []; // Check and fix, its generated and might be dumb
  const count = data?.total_count ?? list.length; // Check and fix, its generated and might be dumb

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Seasons list (${count})`} />
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable columns={seasonsColumns} data={list} rowCount={count} />
      </Suspense>
    </>
  );
}
