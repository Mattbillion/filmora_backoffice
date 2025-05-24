'use client';

import { useState } from 'react';
import { result, set as lodashSet, unset } from 'lodash';
import { useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { objToQs, qsToObj } from '@/lib/utils';

const InputFilter = ({
  name,
  placeholder = 'Search',
}: {
  name: string;
  placeholder?: string;
}) => {
  const searchParams = useSearchParams();
  const queryParams = qsToObj(searchParams.toString());
  const [q, setQ] = useState<string>(result(queryParams, name) || '');
  const router = useRouter();

  const handleSearch = (val: string) => {
    let paramsObj = { ...queryParams };
    if (!!val) {
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

  useDebounce(handleSearch, 800, q);

  return (
    <div className="flex items-center gap-2">
      <Input
        value={q}
        type={'text'}
        className="h-9 w-[200px]"
        placeholder={placeholder}
        onChange={(e) => setQ(e.target.value)}
      />
    </div>
  );
};

export default InputFilter;
