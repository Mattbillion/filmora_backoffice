import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import InputFilter from '@/components/custom/input-filter';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getOptionTypesList } from '@/features/option-types/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { optionTypesColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function OptionTypesPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const [{ data }] = await Promise.all([getOptionTypesList(searchParams)]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`OptionTypes list (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, [
          'create_company_merchandise_attribute_option_value',
        ]) && (
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
          data={data?.data ?? []}
          columns={optionTypesColumns}
          rowCount={data?.total_count ?? data?.data?.length}
        >
          <div className="flex items-center gap-2">
            <InputFilter
              name={'filters.option_name'}
              placeholder={'Нэрээр хайх'}
            />
          </div>
        </DataTable>
      </Suspense>
    </>
  );
}
