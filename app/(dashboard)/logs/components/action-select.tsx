"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogActionType } from "../schema";
import { useQueryString } from "@/hooks/use-query-string";
import { LogSearchParamsType } from "../actions";
import { useRouter } from "next/navigation";
import { objToQs } from "@/lib/utils";

export function SelectAction() {
  const router = useRouter();
  const { actionType, ...qsObj } = useQueryString<LogSearchParamsType>();

  return (
    <Select
      defaultValue={actionType}
      onValueChange={(type) => {
        router.replace(
          `/logs?${objToQs(
            type !== "clear" ? { ...qsObj, page: 1, actionType: type } : qsObj
          )}`
        );
      }}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Action type">
          {actionType ?? "Action type"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.values(LogActionType).map((c, idx) => (
          <SelectItem value={c} key={idx}>
            {c.toUpperCase()}
          </SelectItem>
        ))}
        {!!actionType && (
          <SelectItem value="clear" className="text-red-600">
            Clear
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
