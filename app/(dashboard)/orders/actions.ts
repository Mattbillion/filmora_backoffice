import { xooxFetch } from "@/lib/fetch";
import { INITIAL_PAGINATION, QueryParams } from "@/lib/utils";
import { PaginatedResType } from "@/lib/fetch/types";
import { OrderItemType } from "./schema";
import dayjs from "dayjs";

export const getOrders = async (searchParams: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<OrderItemType[]>>("/report", {
      method: "GET",
      searchParams,
      cache: "no-store",
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching reports:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const downloadOrders = async (searchParams: {endDate: string; startDate: string}) => {
  const { body, error } = await xooxFetch<{url: string}>("/report/download", {
    method: "POST",
    searchParams,
    cache: "no-store",
  });

  if (error) throw new Error(error);
  return { data: body };
};

export const getInitialDateRange = () => {
  const today = dayjs();
  const oneMonthAgo = today.subtract(1, "month");

  return {
    startDate: oneMonthAgo.format("YYYY-MM-DD"),
    endDate: today.format("YYYY-MM-DD")
  }
}