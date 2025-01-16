import { goodaliFetch } from "@/lib/fetch";
import { LogTargetType, LogActionType, LogItemType } from "./schema";
import { INITIAL_PAGINATION } from "@/lib/utils";
import { PaginatedResType } from "@/lib/fetch/types";
import dayjs from "dayjs";

export type LogSearchParamsType = Partial<{
  actionType?: LogActionType; 
  targetType?: LogTargetType;
  page?: string | number;
  limit?: string | number;
}>;

export const getLogs = async (searchParams?: LogSearchParamsType) => {
  try {
    const { body, error } = await goodaliFetch<PaginatedResType<LogItemType[]>>("/log", {
      method: "GET",
      searchParams,
      cache: 'no-store'
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error("Error fetching logs:", error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getInitialDateRange = () => {
  const today = dayjs();
  const oneMonthAgo = today.subtract(1, "month");

  return {
    startDate: oneMonthAgo.format("YYYY-MM-DD"),
    endDate: today.format("YYYY-MM-DD")
  }
}