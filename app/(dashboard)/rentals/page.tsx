import { Suspense } from 'react';

import { auth } from '@/auth';
import { Heading } from '@/components/custom/heading';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/services/api/types';
import { getMoviesRentalCounts } from '@/services/rentals';

import { rentalsColumns } from './columns';

export const dynamic = 'force-dynamic';

export default async function RentalsPage(props: {
  searchParams?: SearchParams<any>;
}) {
  const session = await auth();

  const response = await getMoviesRentalCounts();
  console.log(response, 'response');

  const list = response.data || [];
  const count = response.total_count ?? list.length;

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Rentals list (${count})`} />
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable columns={rentalsColumns} data={list} rowCount={count} />
      </Suspense>
    </>
  );
}
