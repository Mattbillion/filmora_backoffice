import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { Heading } from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';

import { getAlbum } from '../actions';
import { getLectures } from './actions';
import { lectureColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function Lectures(props: {
  searchParams?: Promise<{ albumId: string }>;
}) {
  const searchParams = await props.searchParams;
  const { data } = await getLectures(searchParams);
  const { data: albumData } = searchParams?.albumId
    ? await getAlbum(searchParams?.albumId)
    : { data: null };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Lectures (${data?.pagination?.total ?? data?.data?.length})`}
          description={`Album: ${albumData?.data?.title ?? 'Unknown album'}`}
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
          searchKey="title"
          columns={lectureColumns}
          data={data?.data}
          pageNumber={data?.pagination?.nextPage - 1}
          pageCount={data?.pagination?.pageCount}
        />
      </Suspense>
    </>
  );
}
