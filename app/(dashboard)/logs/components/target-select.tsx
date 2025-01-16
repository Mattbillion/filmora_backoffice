"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogTargetType } from "../schema";
import { useQueryString } from "@/hooks/use-query-string";
import { LogSearchParamsType } from "../actions";
import { useRouter } from "next/navigation";
import { objToQs } from "@/lib/utils";

export function SelectTarget() {
  const router = useRouter();
  const { targetType, ...qsObj } = useQueryString<LogSearchParamsType>();

  return (
    <Select
      defaultValue={targetType}
      onValueChange={(type) => {
        router.replace(
          `/logs?${objToQs(
            type !== "clear" ? { ...qsObj, page: 1, targetType: type } : qsObj
          )}`
        );
      }}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Target type">
          {targetType ?? "Target type"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.values(LogTargetType).map((c, idx) => (
          <SelectItem value={c} key={idx}>
            {c}
          </SelectItem>
        ))}
        {!!targetType && (
          <SelectItem value="clear" className="text-red-600">
            Clear
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
