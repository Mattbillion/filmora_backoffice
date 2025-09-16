import React, { useEffect, useState } from 'react';

import { DataTable } from '@/components/ui/data-table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMedia } from '@/lib/functions';

import { MediaResponse } from '../types';
import { mediaColumns } from './columns';

export function Content() {
  const [data, setData] = useState<MediaResponse>({
    data: [],
    pagination: {
      page: 1,
      page_size: 10,
      total: 0,
      total_pages: 0,
      has_next: false,
      has_prev: false,
    },
  });

  useEffect(() => {
    getMedia().then((res) => {
      if (res.data) {
        setData(res.data);
      }
    });
  }, []);
  return (
    <ScrollArea className="max-h-[500px] p-4 pt-0">
      <DataTable
        columns={mediaColumns}
        data={data?.data}
        rowCount={data?.pagination.page_size ?? data?.data?.length}
      />
    </ScrollArea>
  );
}
