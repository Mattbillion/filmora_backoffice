import { Suspense } from 'react';
import { PlusIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import { Heading } from '@/components/custom/heading';
import { ReplaceBreadcrumdItem } from '@/components/custom/replace-breadcrumd-item';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { hasPermission } from '@/lib/permission';
import { SearchParams } from '@/services/api/types';
import { getMovie } from '@/services/movies-generated';
import { getSeriesSeasons } from '@/services/seasons';

import { seasonsColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function SeasonsPage(props: {
  params: Promise<{ id: string }>;
  searchParams?: SearchParams<{
    page?: number;
    page_size?: number;
  }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const session = await auth();
  const { data: movie } = await getMovie(params.id);
  const { data, total_count } = await getSeriesSeasons(params.id, searchParams);

  const list = data || [];
  const count = total_count ?? list.length;

  if (movie.type !== 'series') return notFound();

  return (
    <>
      <ReplaceBreadcrumdItem
        data={{
          movies: {
            value: movie.title,
            selector: params.id,
          },
        }}
      />
      <div className="flex items-start justify-between">
        <Heading title={`Seasons list (${count})`} />
        {hasPermission(session, 'movies.seasons', 'create') && (
          <CreateDialog>
            <Button variant="outline">
              <PlusIcon /> Шинэ улирал нэмэх
            </Button>
          </CreateDialog>
        )}
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable columns={seasonsColumns} data={list} rowCount={count} />
      </Suspense>
    </>
  );
}
