'use client';

import { result, set as lodashSet, unset } from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { objToQs, qsToObj } from '@/lib/utils';

const StatusFilter = ({
  name = 'filters.status',
  options,
}: {
  name?: string;
  options: Array<{ value: string; label: string }>;
}) => {
  const searchParams = useSearchParams();
  const queryParams = qsToObj(searchParams.toString());
  const router = useRouter();

  const handleSelect = (val: string) => {
    let paramsObj = { ...queryParams };
    if (val !== 'all') {
      lodashSet(paramsObj, name, val);
    } else {
      unset(paramsObj, name);
    }

    if (paramsObj.filters) {
      paramsObj.filters = Object.entries(paramsObj.filters)
        .map(([k, v]) => `${k}=${v}`)
        .join(',');
    }

    router.replace(`?${objToQs(paramsObj)}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={result(queryParams, name)} onValueChange={handleSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Төлөв сонгох" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem defaultChecked value="all">
              Бүгд
            </SelectItem>
            {options.map((option) => (
              <SelectItem value={option.value} key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusFilter;
