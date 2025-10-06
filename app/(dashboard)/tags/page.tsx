import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/auth';
import { Heading } from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';
import { getTags } from '@/services/tags';

import { tagsColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function TagsPage(props: { searchParams?: SearchParams }) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const { data, total_count } = await getTags(searchParams);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Tags list (${total_count ?? data?.length})`} />
        {checkPermission(session, []) && (
          <CreateDialog>
            <Button className="text-xs md:text-sm" variant="outline">
              <Plus className="h-4 w-4" /> Шинэ тааг оруулах
            </Button>
          </CreateDialog>
        )}
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={tagsColumns}
          data={data}
          rowCount={total_count ?? data?.length}
        />
      </Suspense>
    </>
  );
}
