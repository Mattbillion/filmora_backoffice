"use client";

import { Heading } from "@/components/custom/heading";
import { Separator } from "@/components/ui/separator";
import { PaginatedResType } from "@/lib/fetch/types";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { orderColumns } from "./columns";
import { RangePicker, DownloadButton } from "./components";
import { getInitialDateRange, getOrders } from "./actions";
import { OrderItemType } from "./schema";
import { useQueryString } from "@/hooks/use-query-string";

export default function ReportClientPage() {
  const [res, setRes] = useState<PaginatedResType<OrderItemType[]>>();
  const initialDates = getInitialDateRange();
  const qsObj = useQueryString(initialDates);

  useEffect(() => {
    getOrders(qsObj)
      .then(({ data }) => setRes(data))
      .catch(({ data }) => setRes(data));
  }, [qsObj]);

  return (
    <>
      <Heading
        title={`Orders (${res?.pagination?.total ?? res?.data?.length ?? 0})`}
        className="mb-4"
      />
      <Separator />
      <div className="flex items-start justify-between">
        <RangePicker />
        <DownloadButton />
      </div>
      <DataTable
        columns={orderColumns}
        data={res?.data}
        pageNumber={(res?.pagination?.nextPage || 1) - 1}
        pageCount={res?.pagination?.pageCount}
      />
    </>
  );
}
